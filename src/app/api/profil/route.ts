import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Pastikan path ini benar
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // <-- 1. Gunakan prisma singleton
import { Prisma } from "@prisma/client";
import { profileSchema } from "./zod/profile";

// Hapus: import { PrismaClient } from "@prisma/client";
// Hapus: const prisma = new PrismaClient();

// Ini adalah implementasi backend untuk UC-IN-07
export async function GET() {
  const session = await getServerSession(authOptions);

  // 2. Tipe 'session' sekarang sudah benar berkat 'next-auth.d.ts'
  // Kita bisa langsung cek 'session.user.id' tanpa 'any'
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  // 3. 'userId' sekarang type-safe (string)
  const userId = session.user.id;

  // Ambil data profil lengkap
  const profil = await prisma.pengguna.findUnique({
    where: { user_id: parseInt(userId) }, // Tetap parse ke Int untuk query DB
    include: {
      mahasiswa: {
        include: {
          _count: {
            // Rekap aktivitas seperti di Main Flow 3
            select: { enrollments: true, threads: true },
          },
        },
      },
      // Bisa juga include admin jika perlu
    },
  });

  if (!profil) {
    return NextResponse.json(
      { error: "Profil tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json(profil);
}
export async function PATCH(req: Request) {
  try {
    // 1. Cek Sesi Autentikasi
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // 2. Validasi body (mengharapkan data nested)
    const body = await req.json();
    const validation = profileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    // ============= INI PERBAIKANNYA =============
    // Destructure data nested dengan benar
    const {
      nama_lengkap,
      tanggal_lahir,
      nomor_telepon,
      mahasiswa, // <-- Ambil objek 'mahasiswa'
    } = validation.data;
    // ============================================

    // 3. Gunakan Transaksi Prisma
    const [updatedPengguna, updatedMahasiswa] = await prisma.$transaction([
      // Operasi 1: Update tabel Pengguna
      prisma.pengguna.update({
        where: { user_id: userId },
        data: {
          nama_lengkap,
          tanggal_lahir,
          nomor_telepon,
        },
      }),

      // Operasi 2: Upsert tabel Mahasiswa
      prisma.mahasiswa.upsert({
        where: {
          user_id: userId,
        },
        // ============= DAN INI PERBAIKANNYA =============
        update: {
          // Gunakan properti dari objek 'mahasiswa'
          nim: mahasiswa.nim,
          institusi: mahasiswa.institusi,
          program_studi: mahasiswa.program_studi,
        },
        create: {
          user_id: userId,
          // Gunakan properti dari objek 'mahasiswa'
          nim: mahasiswa.nim,
          institusi: mahasiswa.institusi,
          program_studi: mahasiswa.program_studi,
        },
        // ================================================
      }),
    ]);

    // 4. Kirim Respon Sukses
    return NextResponse.json({
      ...updatedPengguna,
      mahasiswa: updatedMahasiswa,
    });
  } catch (error) {
    // 5. Tangani Error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "NIM ini sudah terdaftar oleh pengguna lain." },
          { status: 409 }
        );
      }
    }

    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
