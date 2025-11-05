import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - List semua thread dengan filter dan pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const mahasiswaId = searchParams.get("mahasiswa_id");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { judul: { contains: search, mode: "insensitive" } },
        { isi: { contains: search, mode: "insensitive" } },
      ];
    }

    if (mahasiswaId) {
      where.mahasiswa_id = parseInt(mahasiswaId);
    }

    // Get threads with pagination
    const [threads, total] = await Promise.all([
      prisma.thread.findMany({
        where,
        skip,
        take: limit,
        orderBy: { thread_id: "desc" },
        include: {
          mahasiswa: {
            include: {
              pengguna: {
                select: {
                  nama_lengkap: true,
                  email: true,
                },
              },
            },
          },
          _count: {
            select: {
              komentar: true,
            },
          },
        },
      }),
      prisma.thread.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: threads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data thread",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// POST - Create thread baru
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { judul, isi } = body;

    if (!judul || !isi) {
      return NextResponse.json(
        { success: false, message: "Judul dan isi harus diisi" },
        { status: 400 }
      );
    }

    // Get mahasiswa_id from user
    const pengguna = await prisma.pengguna.findUnique({
      where: { email: session.user.email! },
      include: { mahasiswa: true },
    });

    if (!pengguna?.mahasiswa) {
      return NextResponse.json(
        { success: false, message: "Mahasiswa tidak ditemukan" },
        { status: 404 }
      );
    }

    const thread = await prisma.thread.create({
      data: {
        mahasiswa_id: pengguna.mahasiswa.mahasiswa_id,
        judul,
        isi,
        jumlah_views: 0,
        jumlah_komentar: 0,
      },
      include: {
        mahasiswa: {
          include: {
            pengguna: {
              select: {
                nama_lengkap: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: thread,
        message: "Thread berhasil dibuat",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json(
      { success: false, message: "Gagal membuat thread", error: String(error) },
      { status: 500 }
    );
  }
}
