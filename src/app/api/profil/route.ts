import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Pastikan path ini benar
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // <-- 1. Gunakan prisma singleton

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
