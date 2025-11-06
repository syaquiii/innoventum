// app/api/admin/kursus/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Fix: Typescript lint: session?.user?.role instead of session.user.role
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const kategori = searchParams.get("kategori") || "";
    const level = searchParams.get("level") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    // Build filter
    const where: any = {};

    if (search) {
      where.OR = [
        { judul: { contains: search, mode: "insensitive" } },
        { deskripsi: { contains: search, mode: "insensitive" } },
      ];
    }

    if (kategori) {
      where.kategori = kategori;
    }

    if (level) {
      where.level = level;
    }

    if (status) {
      where.status = status;
    }

    // Get total count
    const total = await prisma.kursus.count({ where });

    // Get paginated data
    const kursus = await prisma.kursus.findMany({
      where,
      skip,
      take: limit,
      include: {
        administrator: {
          include: {
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

    return NextResponse.json({
      data: kursus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching kursus:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Fix: Typescript lint: session?.user?.role instead of session.user.role
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      judul,
      deskripsi,
      kategori,
      thumbnail,
      durasi_menit,
      level,
      status,
    } = body;

    // Validasi: pastikan semua data terisi, kecuali thumbnail boleh null/kosong
    if (
      !judul ||
      !deskripsi ||
      !kategori ||
      durasi_menit === undefined ||
      durasi_menit === null ||
      !level ||
      !status
    ) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Fix: ensure session.user.id is a number for Prisma
    let userId: number | null = null;
    if (session.user && typeof session.user.id === "number") {
      userId = session.user.id;
    } else if (session.user && typeof session.user.id === "string") {
      userId = parseInt(session.user.id, 10);
      if (isNaN(userId)) {
        userId = null;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID in session not valid" },
        { status: 400 }
      );
    }

    // Get admin_id from session.user.id
    const admin = await prisma.administrator.findUnique({
      where: { user_id: userId },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // fix: durasi_menit type to number
    let durasiMenitVal: number;
    if (typeof durasi_menit === "number") {
      durasiMenitVal = durasi_menit;
    } else {
      const parsed = parseInt(durasi_menit, 10);
      if (isNaN(parsed)) {
        return NextResponse.json(
          { error: "Durasi tidak valid" },
          { status: 400 }
        );
      }
      durasiMenitVal = parsed;
    }

    const newKursus = await prisma.kursus.create({
      data: {
        judul,
        deskripsi,
        kategori,
        thumbnail: thumbnail || null,
        durasi_menit: durasiMenitVal,
        level,
        status,
        created_by: admin.admin_id,
      },
      include: {
        administrator: {
          include: {
            pengguna: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Kursus berhasil ditambahkan",
        data: newKursus,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating kursus:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
