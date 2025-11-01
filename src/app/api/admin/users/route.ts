// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// GET - Fetch all users with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const offset = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PenggunaWhereInput = {};

    if (search) {
      where.OR = [
        { nama_lengkap: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role && (role === "mahasiswa" || role === "admin")) {
      where.role = role;
    }

    // Get total count
    const totalUsers = await prisma.pengguna.count({ where });

    // Get users with relations
    const users = await prisma.pengguna.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { user_id: "desc" },
      select: {
        user_id: true,
        email: true,
        nama_lengkap: true,
        tanggal_lahir: true,
        nomor_telepon: true,
        role: true,
        emailVerified: true,
        image: true,
        mahasiswa: {
          select: {
            mahasiswa_id: true,
            nim: true,
            institusi: true,
            program_studi: true,
            jumlah_kursus_selesai: true,
            foto_profil: true,
          },
        },
        administrator: {
          select: {
            admin_id: true,
            nik: true,
            jabatan: true,
            level_akses: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      email,
      password,
      nama_lengkap,
      tanggal_lahir,
      nomor_telepon,
      role,
      // Mahasiswa fields
      nim,
      institusi,
      program_studi,
      // Administrator fields
      nik,
      jabatan,
      level_akses,
    } = body;

    // Validate required fields
    if (!email || !nama_lengkap || !role) {
      return NextResponse.json(
        { error: "Email, nama lengkap, and role are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.pengguna.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password if provided
    let hashedPassword: string | null = null;
    if (password) {
      const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(password + (process.env.PASSWORD_SALT || ""))
      );
      hashedPassword = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }

    // Create user with role-specific data
    const userData: Prisma.PenggunaCreateInput = {
      email,
      password: hashedPassword,
      nama_lengkap,
      tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
      nomor_telepon,
      role,
    };

    if (role === "mahasiswa") {
      if (!nim || !institusi || !program_studi) {
        return NextResponse.json(
          {
            error:
              "NIM, institusi, and program studi are required for mahasiswa",
          },
          { status: 400 }
        );
      }

      // Check if NIM already exists
      const existingMahasiswa = await prisma.mahasiswa.findUnique({
        where: { nim },
      });

      if (existingMahasiswa) {
        return NextResponse.json(
          { error: "NIM already registered" },
          { status: 400 }
        );
      }

      userData.mahasiswa = {
        create: {
          nim,
          institusi,
          program_studi,
        },
      };
    } else if (role === "admin") {
      if (!nik || !jabatan || !level_akses) {
        return NextResponse.json(
          { error: "NIK, jabatan, and level akses are required for admin" },
          { status: 400 }
        );
      }

      // Check if NIK already exists
      const existingAdmin = await prisma.administrator.findUnique({
        where: { nik },
      });

      if (existingAdmin) {
        return NextResponse.json(
          { error: "NIK already registered" },
          { status: 400 }
        );
      }

      userData.administrator = {
        create: {
          nik,
          jabatan,
          level_akses,
        },
      };
    }

    const newUser = await prisma.pengguna.create({
      data: userData,
      include: {
        mahasiswa: true,
        administrator: true,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
