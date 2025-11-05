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

    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json();

    const {
      email,
      nama_lengkap,
      tanggal_lahir,
      nomor_telepon,
      role, // ⭐ TAMBAHKAN INI
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

    // ⭐ PERBAIKAN: Deteksi perubahan role
    const isRoleChanged = role && role !== existingUser.role;

    // Update user data
    const updateData: Prisma.PenggunaUpdateInput = {
      ...(email !== undefined && { email }),
      ...(nama_lengkap !== undefined && { nama_lengkap }),
      ...(tanggal_lahir !== undefined && {
        tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
      }),
      ...(nomor_telepon !== undefined && { nomor_telepon }),
      ...(role !== undefined && { role }), // ⭐ TAMBAHKAN INI
    };

    // ⭐ PERBAIKAN: Gunakan transaction untuk perubahan role
    let updatedUser;

    if (isRoleChanged) {
      // Gunakan transaction untuk memastikan atomicity
      updatedUser = await prisma.$transaction(async (tx) => {
        // 1. Hapus relasi lama
        if (existingUser.role === "mahasiswa" && existingUser.mahasiswa) {
          await tx.mahasiswa.delete({
            where: { user_id: userId },
          });
        } else if (
          existingUser.role === "admin" &&
          existingUser.administrator
        ) {
          await tx.administrator.delete({
            where: { user_id: userId },
          });
        }

        // 2. Update user dengan role baru
        const updated = await tx.pengguna.update({
          where: { user_id: userId },
          data: updateData,
        });

        // 3. Buat relasi baru sesuai role baru
        if (role === "mahasiswa") {
          await tx.mahasiswa.create({
            data: {
              user_id: userId,
              nim: nim || "",
              institusi: institusi || "",
              program_studi: program_studi || "",
              jumlah_kursus_selesai: 0,
              foto_profil: foto_profil || null,
            },
          });
        } else if (role === "admin") {
          await tx.administrator.create({
            data: {
              user_id: userId,
              nik: nik || "",
              jabatan: jabatan || "",
              level_akses: level_akses || "terbatas",
            },
          });
        }

        // 4. Fetch hasil akhir dengan relasi
        return tx.pengguna.findUnique({
          where: { user_id: userId },
          include: {
            mahasiswa: true,
            administrator: true,
          },
        });
      });
    } else {
      // ⭐ Jika role TIDAK berubah, update relasi yang ada seperti biasa
      if (existingUser.role === "mahasiswa" && existingUser.mahasiswa) {
        const mahasiswaUpdate: Prisma.MahasiswaUpdateInput = {};
        if (nim !== undefined) mahasiswaUpdate.nim = nim;
        if (institusi !== undefined) mahasiswaUpdate.institusi = institusi;
        if (program_studi !== undefined)
          mahasiswaUpdate.program_studi = program_studi;
        if (foto_profil !== undefined)
          mahasiswaUpdate.foto_profil = foto_profil;

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

      updatedUser = await prisma.pengguna.update({
        where: { user_id: userId },
        data: updateData,
        include: {
          mahasiswa: true,
          administrator: true,
        },
      });
    }

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

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
