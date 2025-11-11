import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { profileSchema } from "./zod/profile";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    // Ambil data profil lengkap dengan statistik aktivitas
    const profil = await prisma.pengguna.findUnique({
      where: { user_id: userId },
      include: {
        mahasiswa: {
          include: {
            // Hitung jumlah aktivitas
            _count: {
              select: {
                threads: true,
                komentar: true,
                proyekBisnis: true,
                enrollments: true,
              },
            },
            // Ambil threads terbaru (5 terakhir)
            threads: {
              take: 5,
              orderBy: { thread_id: "desc" }, // Karena tidak ada created_at
              select: {
                thread_id: true,
                judul: true,
                isi: true,
                jumlah_views: true,
                jumlah_komentar: true,
                _count: {
                  select: { komentar: true },
                },
              },
            },
            // Ambil komentar terbaru (5 terakhir)
            komentar: {
              take: 5,
              orderBy: { tanggal_dibuat: "desc" },
              select: {
                komentar_id: true,
                isi_komentar: true,
                tanggal_dibuat: true,
                thread: {
                  select: {
                    judul: true,
                  },
                },
              },
            },
            // Ambil proyek bisnis
            proyekBisnis: {
              orderBy: { proyek_id: "desc" }, // Karena tidak ada created_at
              select: {
                proyek_id: true,
                nama_proyek: true,
                deskripsi: true,
                status_proyek: true,
                dokumen: true,
              },
            },
            // Ambil enrollments (kursus yang diikuti)
            enrollments: {
              orderBy: { tanggal_mulai: "desc" },
              select: {
                enrollment_id: true,
                tanggal_mulai: true,
                tanggal_selesai: true,
                status: true,
                progres_persen: true,
                kursus: {
                  select: {
                    kursus_id: true,
                    judul: true,
                    deskripsi: true,
                    kategori: true,
                    level: true,
                    thumbnail: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!profil) {
      return NextResponse.json(
        { error: "Profil tidak ditemukan" },
        { status: 404 }
      );
    }

    // Format response dengan statistik
    const response = {
      ...profil,
      statistik: profil.mahasiswa
        ? {
            total_threads: profil.mahasiswa._count.threads,
            total_komentar: profil.mahasiswa._count.komentar,
            total_proyek: profil.mahasiswa._count.proyekBisnis,
            total_courses: profil.mahasiswa._count.enrollments,
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching profile:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Gagal mengambil data profil",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await req.json();
    const validation = profileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const { nama_lengkap, tanggal_lahir, nomor_telepon, mahasiswa } =
      validation.data;

    const [updatedPengguna, updatedMahasiswa] = await prisma.$transaction([
      prisma.pengguna.update({
        where: { user_id: userId },
        data: {
          nama_lengkap,
          tanggal_lahir,
          nomor_telepon,
        },
      }),
      prisma.mahasiswa.upsert({
        where: { user_id: userId },
        update: {
          nim: mahasiswa.nim,
          institusi: mahasiswa.institusi,
          program_studi: mahasiswa.program_studi,
        },
        create: {
          user_id: userId,
          nim: mahasiswa.nim,
          institusi: mahasiswa.institusi,
          program_studi: mahasiswa.program_studi,
        },
      }),
    ]);

    return NextResponse.json({
      ...updatedPengguna,
      mahasiswa: updatedMahasiswa,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "NIM ini sudah terdaftar oleh pengguna lain." },
          { status: 409 }
        );
      }
    }

    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
