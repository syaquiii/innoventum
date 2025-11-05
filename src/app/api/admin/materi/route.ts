// app/api/admin/materi/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// HAPUS parameter context karena route ini tidak punya dynamic params
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const kursusId = searchParams.get("kursus_id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const tipeKonten = searchParams.get("tipe_konten") || "";

    const skip = (page - 1) * limit;

    const where: any = {};

    if (kursusId) {
      where.kursus_id = parseInt(kursusId);
    }

    if (search) {
      where.judul_materi = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (tipeKonten) {
      where.tipe_konten = tipeKonten;
    }

    const [materi, total] = await Promise.all([
      prisma.materi.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ kursus_id: "asc" }, { urutan: "asc" }],
        include: {
          kursus: {
            select: {
              kursus_id: true,
              judul: true,
              kategori: true,
            },
          },
        },
      }),
      prisma.materi.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: materi,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching materi:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      kursus_id,
      judul_materi,
      urutan,
      tipe_konten,
      url_konten,
      durasi_menit,
    } = body;

    // Validasi input
    if (
      !kursus_id ||
      !judul_materi ||
      urutan === undefined ||
      !tipe_konten ||
      !url_konten
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Cek apakah kursus exists
    const kursus = await prisma.kursus.findUnique({
      where: { kursus_id: parseInt(kursus_id) },
    });

    if (!kursus) {
      return NextResponse.json({ error: "Kursus not found" }, { status: 404 });
    }

    // Cek apakah urutan sudah digunakan
    const existingMateri = await prisma.materi.findFirst({
      where: {
        kursus_id: parseInt(kursus_id),
        urutan: parseInt(urutan),
      },
    });

    if (existingMateri) {
      return NextResponse.json(
        { error: "Urutan sudah digunakan untuk kursus ini" },
        { status: 400 }
      );
    }

    const newMateri = await prisma.materi.create({
      data: {
        kursus_id: parseInt(kursus_id),
        judul_materi,
        urutan: parseInt(urutan),
        tipe_konten,
        url_konten,
        durasi_menit: durasi_menit ? parseInt(durasi_menit) : null,
      },
      include: {
        kursus: {
          select: {
            kursus_id: true,
            judul: true,
            kategori: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newMateri,
        message: "Materi berhasil ditambahkan",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating materi:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
