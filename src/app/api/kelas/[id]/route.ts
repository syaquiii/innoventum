// app/api/kelas/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Sesuaikan path
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const kursusId = parseInt(id);

    if (isNaN(kursusId)) {
      return NextResponse.json({ error: "Invalid kursus ID" }, { status: 400 });
    }

    // Query detail kursus dengan semua relasi
    const kursus = await prisma.kursus.findUnique({
      where: {
        kursus_id: kursusId,
      },
      include: {
        administrator: {
          select: {
            admin_id: true,
            jabatan: true,
            pengguna: {
              select: {
                nama_lengkap: true,
                email: true,
              },
            },
          },
        },
        materi: {
          orderBy: {
            urutan: "asc",
          },
          select: {
            materi_id: true,
            judul_materi: true,
            urutan: true,
            tipe_konten: true,
            url_konten: true,
            durasi_menit: true,
          },
        },
        enrollments: {
          select: {
            enrollment_id: true,
            mahasiswa_id: true,
            tanggal_mulai: true,
            status: true,
            mahasiswa: {
              select: {
                pengguna: {
                  select: {
                    nama_lengkap: true,
                    image: true,
                  },
                },
              },
            },
          },
          take: 10,
          orderBy: {
            tanggal_mulai: "desc",
          },
        },
        _count: {
          select: {
            enrollments: true,
            materi: true,
          },
        },
      },
    });

    if (!kursus) {
      return NextResponse.json(
        { error: "Kursus tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek apakah user sudah enroll
    let isEnrolled = false;
    let userEnrollment = null;

    if (session.user.role === "mahasiswa") {
      // Ambil user_id dari session (bisa dari email atau id)
      const userEmail = session.user.email;

      if (userEmail) {
        // Cari pengguna berdasarkan email
        const pengguna = await prisma.pengguna.findUnique({
          where: { email: userEmail },
          select: { user_id: true },
        });

        if (pengguna) {
          // Ambil mahasiswa_id dari user_id
          const mahasiswa = await prisma.mahasiswa.findUnique({
            where: { user_id: pengguna.user_id },
            select: { mahasiswa_id: true },
          });

          if (mahasiswa) {
            userEnrollment = await prisma.enrollment.findFirst({
              where: {
                mahasiswa_id: mahasiswa.mahasiswa_id,
                kursus_id: kursusId,
              },
              select: {
                enrollment_id: true,
                tanggal_mulai: true,
                tanggal_selesai: true,
                progres_persen: true,
                status: true,
              },
            });

            isEnrolled = !!userEnrollment;
          }
        }
      }
    }

    // Hitung total durasi dari semua materi
    const totalDurasi = kursus.materi.reduce(
      (acc, materi) => acc + (materi.durasi_menit || 0),
      0
    );

    // Group materi by tipe
    const materiByTipe = kursus.materi.reduce((acc, materi) => {
      const tipe = materi.tipe_konten;
      if (!acc[tipe]) {
        acc[tipe] = [];
      }
      acc[tipe].push(materi);
      return acc;
    }, {} as Record<string, typeof kursus.materi>);

    // Transform response
    const response = {
      id: kursus.kursus_id,
      judul: kursus.judul,
      deskripsi: kursus.deskripsi,
      kategori: kursus.kategori,
      thumbnail: kursus.thumbnail,
      durasi: kursus.durasi_menit,
      totalDurasiMateri: totalDurasi,
      level: kursus.level,
      status: kursus.status,
      instruktur: {
        nama: kursus.administrator.pengguna.nama_lengkap,
        email: kursus.administrator.pengguna.email,
        jabatan: kursus.administrator.jabatan,
      },
      statistik: {
        jumlahPeserta: kursus._count.enrollments,
        jumlahMateri: kursus._count.materi,
        jumlahVideo: materiByTipe.video?.length || 0,
        jumlahDokumen: materiByTipe.dokumen?.length || 0,
        jumlahLatihan: materiByTipe.latihan?.length || 0,
      },
      materi: kursus.materi.map((m) => ({
        id: m.materi_id,
        judul: m.judul_materi,
        urutan: m.urutan,
        tipe: m.tipe_konten,
        url: m.url_konten,
        durasi: m.durasi_menit,
      })),
      materiByTipe: {
        video:
          materiByTipe.video?.map((m) => ({
            id: m.materi_id,
            judul: m.judul_materi,
            urutan: m.urutan,
            durasi: m.durasi_menit,
          })) || [],
        dokumen:
          materiByTipe.dokumen?.map((m) => ({
            id: m.materi_id,
            judul: m.judul_materi,
            urutan: m.urutan,
          })) || [],
        latihan:
          materiByTipe.latihan?.map((m) => ({
            id: m.materi_id,
            judul: m.judul_materi,
            urutan: m.urutan,
          })) || [],
      },
      pesertaTerbaru: kursus.enrollments.map((e) => ({
        id: e.enrollment_id,
        nama: e.mahasiswa.pengguna.nama_lengkap,
        foto: e.mahasiswa.pengguna.image,
        tanggalBergabung: e.tanggal_mulai,
        status: e.status,
      })),
      enrollment: isEnrolled
        ? {
            id: userEnrollment?.enrollment_id,
            tanggalMulai: userEnrollment?.tanggal_mulai,
            tanggalSelesai: userEnrollment?.tanggal_selesai,
            progres: userEnrollment?.progres_persen,
            status: userEnrollment?.status,
          }
        : null,
      isEnrolled,
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching kursus detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Enroll ke kursus
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "mahasiswa") {
      return NextResponse.json(
        { error: "Hanya mahasiswa yang dapat mendaftar kursus" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const kursusId = parseInt(id);

    if (isNaN(kursusId)) {
      return NextResponse.json({ error: "Invalid kursus ID" }, { status: 400 });
    }

    // Cek apakah kursus ada dan published
    const kursus = await prisma.kursus.findUnique({
      where: { kursus_id: kursusId },
      select: {
        kursus_id: true,
        status: true,
        judul: true,
      },
    });

    if (!kursus) {
      return NextResponse.json(
        { error: "Kursus tidak ditemukan" },
        { status: 404 }
      );
    }

    if (kursus.status !== "published") {
      return NextResponse.json(
        { error: "Kursus tidak tersedia untuk pendaftaran" },
        { status: 400 }
      );
    }

    // Ambil mahasiswa_id
    const userEmail = session.user.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Email tidak ditemukan" },
        { status: 400 }
      );
    }

    // Cari pengguna berdasarkan email
    const pengguna = await prisma.pengguna.findUnique({
      where: { email: userEmail },
      select: { user_id: true },
    });

    if (!pengguna) {
      return NextResponse.json(
        { error: "Data pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { user_id: pengguna.user_id },
      select: { mahasiswa_id: true },
    });

    if (!mahasiswa) {
      return NextResponse.json(
        { error: "Data mahasiswa tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek apakah sudah terdaftar
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        mahasiswa_id: mahasiswa.mahasiswa_id,
        kursus_id: kursusId,
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Anda sudah terdaftar di kursus ini" },
        { status: 400 }
      );
    }

    // Buat enrollment baru
    const newEnrollment = await prisma.enrollment.create({
      data: {
        mahasiswa_id: mahasiswa.mahasiswa_id,
        kursus_id: kursusId,
        tanggal_mulai: new Date(),
        progres_persen: 0,
        status: "ongoing",
      },
      include: {
        kursus: {
          select: {
            judul: true,
            thumbnail: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Berhasil mendaftar ke kursus",
      data: {
        enrollmentId: newEnrollment.enrollment_id,
        kursus: {
          id: kursusId,
          judul: newEnrollment.kursus.judul,
          thumbnail: newEnrollment.kursus.thumbnail,
        },
        tanggalMulai: newEnrollment.tanggal_mulai,
      },
    });
  } catch (error) {
    console.error("Error enrolling to kursus:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
