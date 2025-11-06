import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori");
    const level = searchParams.get("level");
    const status = searchParams.get("status") || "published";

    // Query kursus dengan filter
    const whereClause: any = {
      status: status as any,
    };

    if (kategori) {
      whereClause.kategori = kategori;
    }

    if (level) {
      whereClause.level = level as any;
    }

    const kursus = await prisma.kursus.findMany({
      where: whereClause,
      select: {
        kursus_id: true,
        judul: true,
        deskripsi: true,
        kategori: true,
        thumbnail: true,
        durasi_menit: true,
        level: true,
        status: true,
        administrator: {
          select: {
            pengguna: {
              select: {
                nama_lengkap: true,
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            materi: true,
          },
        },
      },
      orderBy: {
        kursus_id: "desc",
      },
    });

    // Transform data untuk response
    const transformedKursus = kursus.map((k) => ({
      id: k.kursus_id,
      judul: k.judul,
      deskripsi: k.deskripsi,
      kategori: k.kategori,
      thumbnail: k.thumbnail,
      durasi: k.durasi_menit,
      level: k.level,
      status: k.status,
      instruktur: k.administrator.pengguna.nama_lengkap,
      jumlahPeserta: k._count.enrollments,
      jumlahMateri: k._count.materi,
    }));

    return NextResponse.json({
      success: true,
      data: transformedKursus,
    });
  } catch (error) {
    console.error("Error fetching kursus:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET kursus berdasarkan ID
export async function GET_BY_ID(kursusId: number) {
  try {
    const kursus = await prisma.kursus.findUnique({
      where: { kursus_id: kursusId },
      include: {
        administrator: {
          select: {
            pengguna: {
              select: {
                nama_lengkap: true,
              },
            },
          },
        },
        materi: {
          orderBy: {
            urutan: "asc",
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!kursus) {
      return null;
    }

    return {
      id: kursus.kursus_id,
      judul: kursus.judul,
      deskripsi: kursus.deskripsi,
      kategori: kursus.kategori,
      thumbnail: kursus.thumbnail,
      durasi: kursus.durasi_menit,
      level: kursus.level,
      status: kursus.status,
      instruktur: kursus.administrator.pengguna.nama_lengkap,
      jumlahPeserta: kursus._count.enrollments,
      materi: kursus.materi,
    };
  } finally {
    await prisma.$disconnect();
  }
}
