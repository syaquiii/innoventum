import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// GET - Fetch single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params karena sudah Promise di Next.js 15+
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);

    // Validasi jika ID bukan angka
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await prisma.pengguna.findUnique({
      where: { user_id: userId },
      include: {
        mahasiswa: true,
        administrator: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params karena sudah Promise di Next.js 15+
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);

    // Validasi jika ID bukan angka
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json();

    const {
      email,
      nama_lengkap,
      tanggal_lahir,
      nomor_telepon,
      // Mahasiswa fields
      nim,
      institusi,
      program_studi,
      foto_profil,
      // Administrator fields
      nik,
      jabatan,
      level_akses,
    } = body;

    // Check if user exists
    const existingUser = await prisma.pengguna.findUnique({
      where: { user_id: userId },
      include: {
        mahasiswa: true,
        administrator: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user data
    const updateData: Prisma.PenggunaUpdateInput = {
      // Hanya update field jika nilainya ada (bukan undefined)
      ...(email !== undefined && { email }),
      ...(nama_lengkap !== undefined && { nama_lengkap }),
      ...(tanggal_lahir !== undefined && {
        tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
      }),
      ...(nomor_telepon !== undefined && { nomor_telepon }),
    };

    // Update role-specific data
    if (existingUser.role === "mahasiswa" && existingUser.mahasiswa) {
      const mahasiswaUpdate: Prisma.MahasiswaUpdateInput = {};
      if (nim !== undefined) mahasiswaUpdate.nim = nim;
      if (institusi !== undefined) mahasiswaUpdate.institusi = institusi;
      if (program_studi !== undefined)
        mahasiswaUpdate.program_studi = program_studi;
      if (foto_profil !== undefined) mahasiswaUpdate.foto_profil = foto_profil;

      if (Object.keys(mahasiswaUpdate).length > 0) {
        updateData.mahasiswa = {
          update: mahasiswaUpdate,
        };
      }
    } else if (existingUser.role === "admin" && existingUser.administrator) {
      const adminUpdate: Prisma.AdministratorUpdateInput = {};
      if (nik !== undefined) adminUpdate.nik = nik;
      if (jabatan !== undefined) adminUpdate.jabatan = jabatan;
      if (level_akses !== undefined) adminUpdate.level_akses = level_akses;

      if (Object.keys(adminUpdate).length > 0) {
        updateData.administrator = {
          update: adminUpdate,
        };
      }
    }

    const updatedUser = await prisma.pengguna.update({
      where: { user_id: userId },
      data: updateData,
      include: {
        mahasiswa: true,
        administrator: true,
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params karena sudah Promise di Next.js 15+
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);

    // Validasi jika ID bukan angka
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.pengguna.findUnique({
      where: { user_id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent self-deletion
    if (session?.user?.id && parseInt(session.user.id) === userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete user (cascade will handle related records)
    await prisma.pengguna.delete({
      where: { user_id: userId },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
