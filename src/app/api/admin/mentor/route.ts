// app/api/admin/mentor/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";

// Validation Schema
const createMentorSchema = z.object({
  nama: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  bio: z.string().min(10, "Bio minimal 10 karakter"),
  keahlian: z
    .string()
    .min(3, "Keahlian minimal 3 karakter")
    .max(255, "Keahlian maksimal 255 karakter"),
  foto: z.string().optional().nullable(),
  email_kontak: z
    .string()
    .email("Format email tidak valid")
    .max(100, "Email maksimal 100 karakter"),
  linkedin: z
    .string()
    .url("Format URL LinkedIn tidak valid")
    .optional()
    .nullable(),
  status: z.enum(["aktif", "nonaktif"]).default("aktif"),
});

// GET - Display Mentor List (Admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication and authorization
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak: Anda bukan administrator" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const keahlian = searchParams.get("keahlian") || "";

    const offset = (page - 1) * limit;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: "insensitive" } },
        { keahlian: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (keahlian) {
      where.keahlian = { contains: keahlian, mode: "insensitive" };
    }

    // Get mentors with admin info
    const [mentors, totalMentors] = await Promise.all([
      prisma.mentor.findMany({
        where,
        include: {
          administrator: {
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
        orderBy: { mentor_id: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.mentor.count({ where }),
    ]);

    // Format response - PENTING: Gunakan mentor_id bukan id
    const formattedMentors = mentors.map((mentor) => ({
      mentor_id: mentor.mentor_id, // ✅ Gunakan mentor_id
      nama: mentor.nama,
      bio: mentor.bio,
      keahlian: mentor.keahlian,
      foto: mentor.foto,
      email_kontak: mentor.email_kontak,
      linkedin: mentor.linkedin,
      status: mentor.status,
      created_by: {
        id: mentor.administrator.admin_id,
        nama: mentor.administrator.pengguna.nama_lengkap,
        email: mentor.administrator.pengguna.email,
      },
    }));

    console.log(
      "GET /api/admin/mentor - Sample response:",
      formattedMentors[0]
    ); // Debug log

    return NextResponse.json({
      success: true,
      data: formattedMentors,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalMentors / limit),
        totalItems: totalMentors,
        perPage: limit,
      },
      filters: {
        search,
        status,
        keahlian,
      },
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json(
      { error: "Gagal memuat daftar mentor" },
      { status: 500 }
    );
  }
}

// POST - Create Mentor Profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication and authorization
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak: Anda bukan administrator" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = createMentorSchema.parse(body);

    // Get admin_id from user_id
    const admin = await prisma.administrator.findUnique({
      where: { user_id: Number(session.user.id) },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Administrator tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check duplicate email
    const existingMentor = await prisma.mentor.findFirst({
      where: { email_kontak: validatedData.email_kontak },
    });

    if (existingMentor) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Create mentor
    const mentor = await prisma.mentor.create({
      data: {
        nama: validatedData.nama,
        bio: validatedData.bio,
        keahlian: validatedData.keahlian,
        foto: validatedData.foto || null,
        email_kontak: validatedData.email_kontak,
        linkedin: validatedData.linkedin || null,
        status: validatedData.status,
        created_by: admin.admin_id,
      },
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
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profil mentor berhasil dibuat",
        data: {
          mentor_id: mentor.mentor_id, // ✅ Gunakan mentor_id
          nama: mentor.nama,
          bio: mentor.bio,
          keahlian: mentor.keahlian,
          foto: mentor.foto,
          email_kontak: mentor.email_kontak,
          linkedin: mentor.linkedin,
          status: mentor.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating mentor:", error);

    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        {
          error: firstError.message || "Data yang diinput tidak valid",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat profil mentor" },
      { status: 500 }
    );
  }
}
