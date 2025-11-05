// app/api/admin/proyek/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const mahasiswaId = searchParams.get("mahasiswa_id") || "";

    const skip = (page - 1) * limit;

    // Build filter
    const where: any = {};

    if (search) {
      where.OR = [
        { nama_proyek: { contains: search, mode: "insensitive" } },
        { deskripsi: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status_proyek = status;
    }

    if (mahasiswaId) {
      where.mahasiswa_id = parseInt(mahasiswaId);
    }

    // Get total count
    const total = await prisma.proyekBisnis.count({ where });

    // Get proyek with pagination
    const proyek = await prisma.proyekBisnis.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        proyek_id: "desc",
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

    return NextResponse.json({
      success: true,
      data: proyek,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching proyek:", error);
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
    const { mahasiswa_id, nama_proyek, deskripsi, status_proyek, dokumen } =
      body;

    // Validation
    if (!mahasiswa_id || !nama_proyek || !status_proyek) {
      return NextResponse.json(
        { error: "mahasiswa_id, nama_proyek, dan status_proyek wajib diisi" },
        { status: 400 }
      );
    }

    // Check if mahasiswa exists
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { mahasiswa_id: parseInt(mahasiswa_id) },
    });

    if (!mahasiswa) {
      return NextResponse.json(
        { error: "Mahasiswa tidak ditemukan" },
        { status: 404 }
      );
    }

    const proyek = await prisma.proyekBisnis.create({
      data: {
        mahasiswa_id: parseInt(mahasiswa_id),
        nama_proyek,
        deskripsi: deskripsi || null,
        status_proyek,
        dokumen: dokumen || null,
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
        message: "Proyek berhasil ditambahkan",
        data: proyek,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating proyek:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
