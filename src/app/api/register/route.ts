import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma"; // <-- Menggunakan prisma singleton
import bcrypt from "bcrypt";

// Hapus baris ini: const prisma = new PrismaClient();

/**
 * Handle POST request to create a new user and student.
 * Ini adalah implementasi dari UC-IN-01: Melakukan Registrasi.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      nama_lengkap,
      tanggal_lahir,
      nomor_telepon,
      nim,
      institusi,
      program_studi,
    } = body;

    // --- Validasi Main Flow 5 ---
    if (
      !email ||
      !password ||
      !nama_lengkap ||
      !tanggal_lahir ||
      !nomor_telepon ||
      !nim ||
      !institusi ||
      !program_studi
    ) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // --- Alternative Flow 2: Email sudah terdaftar ---
    const existingUser = await prisma.pengguna.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 } // 409 Conflict
      );
    }

    // Validasi tambahan: Cek NIM
    const existingMahasiswa = await prisma.mahasiswa.findUnique({
      where: { nim: nim },
    });

    if (existingMahasiswa) {
      return NextResponse.json(
        { error: "NIM sudah terdaftar" },
        { status: 409 }
      );
    }

    // --- Main Flow 6: Membuat akun ---
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat Pengguna dan Mahasiswa dalam satu transaksi
    const newUser = await prisma.pengguna.create({
      data: {
        email,
        password: hashedPassword,
        nama_lengkap,
        tanggal_lahir: new Date(tanggal_lahir), // Pastikan format tanggal benar
        nomor_telepon,
        role: Role.mahasiswa, // Sesuai enum
        // Buat data mahasiswa yang terhubung
        mahasiswa: {
          create: {
            nim,
            institusi,
            program_studi,
            jumlah_kursus_selesai: 0, // Default value
          },
        },
      },
      // Ambil data mahasiswa yang baru dibuat
      include: {
        mahasiswa: true,
      },
    });

    // Hapus password dari object yang dikirim kembali
    const { password: _, ...userWithoutPassword } = newUser;

    // --- Main Flow 7: Registrasi Berhasil ---
    return NextResponse.json(userWithoutPassword, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("Registrasi Gagal:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
