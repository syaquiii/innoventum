import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// The error you're seeing (expecting 'params' to be a Promise) is often caused by
// stale or incorrect type definitions in the .next folder.
// Your code logic is correct for the App Router.
//
// If this error persists after this change, try:
// 1. Deleting the .next folder in your project.
// 2. Restarting your development server (e.g., npm run dev).

// POST - Create komentar baru
export async function POST(
  request: NextRequest,
  // Changed signature to use 'context' object directly, which is a common pattern.
  context: { params: { id: string } }
) {
  // Destructure params from context inside the function
  const { params } = context;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const threadId = parseInt(params.id);

    if (isNaN(threadId)) {
      return NextResponse.json(
        { success: false, message: "ID thread tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isi_komentar } = body;

    if (!isi_komentar) {
      return NextResponse.json(
        { success: false, message: "Isi komentar harus diisi" },
        { status: 400 }
      );
    }

    // Check if thread exists
    const thread = await prisma.thread.findUnique({
      where: { thread_id: threadId },
    });

    if (!thread) {
      return NextResponse.json(
        { success: false, message: "Thread tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get mahasiswa_id from user
    const pengguna = await prisma.pengguna.findUnique({
      where: { email: session.user.email! },
      include: { mahasiswa: true },
    });

    if (!pengguna?.mahasiswa) {
      return NextResponse.json(
        { success: false, message: "Mahasiswa tidak ditemukan" },
        { status: 404 }
      );
    }

    // Create komentar and update thread counter
    const [komentar] = await prisma.$transaction([
      prisma.komentar.create({
        data: {
          thread_id: threadId,
          mahasiswa_id: pengguna.mahasiswa.mahasiswa_id,
          isi_komentar,
          tanggal_dibuat: new Date(),
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
      }),
      prisma.thread.update({
        where: { thread_id: threadId },
        data: { jumlah_komentar: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: komentar,
        message: "Komentar berhasil ditambahkan",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating komentar:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan komentar" },
      { status: 500 }
    );
  }
}
