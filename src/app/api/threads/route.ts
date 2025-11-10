// app/api/threads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Ambil semua threads
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { judul: { contains: search, mode: "insensitive" as const } },
            { isi: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [threads, total] = await Promise.all([
      prisma.thread.findMany({
        where,
        skip,
        take: limit,
        include: {
          mahasiswa: {
            include: {
              pengguna: {
                select: {
                  image: true,
                  nama_lengkap: true,
                  email: true,
                },
              },
            },
          },
          _count: {
            select: { komentar: true },
          },
        },
        orderBy: { thread_id: "desc" },
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
      { success: false, error: "Failed to fetch threads" },
      { status: 500 }
    );
  }
}

// POST - Buat thread baru
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { judul, isi } = body;

    if (!judul || !isi) {
      return NextResponse.json(
        { success: false, error: "Judul dan isi harus diisi" },
        { status: 400 }
      );
    }

    // Cari mahasiswa_id dari user_id
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { user_id: Number(session.user.id) },
    });

    if (!mahasiswa) {
      return NextResponse.json(
        { success: false, error: "Mahasiswa tidak ditemukan" },
        { status: 404 }
      );
    }

    const thread = await prisma.thread.create({
      data: {
        mahasiswa_id: mahasiswa.mahasiswa_id,

        judul,
        isi,
      },
      include: {
        mahasiswa: {
          include: {
            pengguna: {
              select: {
                nama_lengkap: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: thread,
    });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create thread" },
      { status: 500 }
    );
  }
}
