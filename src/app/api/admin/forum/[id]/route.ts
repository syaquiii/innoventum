import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Detail thread dengan komentar
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const threadId = parseInt(params.id);

    if (isNaN(threadId)) {
      return NextResponse.json(
        { success: false, message: "ID thread tidak valid" },
        { status: 400 }
      );
    }

    const thread = await prisma.thread.findUnique({
      where: { thread_id: threadId },
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
        komentar: {
          orderBy: { tanggal_dibuat: "asc" },
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
        },
      },
    });

    if (!thread) {
      return NextResponse.json(
        { success: false, message: "Thread tidak ditemukan" },
        { status: 404 }
      );
    }

    // Increment views
    await prisma.thread.update({
      where: { thread_id: threadId },
      data: { jumlah_views: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      data: thread,
    });
  } catch (error) {
    console.error("Error fetching thread detail:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil detail thread" },
      { status: 500 }
    );
  }
}

// PUT - Update thread
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { judul, isi } = body;

    // Check if thread exists and user is owner
    const existingThread = await prisma.thread.findUnique({
      where: { thread_id: threadId },
      include: {
        mahasiswa: {
          include: {
            pengguna: true,
          },
        },
      },
    });

    if (!existingThread) {
      return NextResponse.json(
        { success: false, message: "Thread tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check ownership (only thread owner can edit)
    if (existingThread.mahasiswa.pengguna.email !== session.user.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda tidak memiliki akses untuk mengedit thread ini",
        },
        { status: 403 }
      );
    }

    const thread = await prisma.thread.update({
      where: { thread_id: threadId },
      data: {
        ...(judul && { judul }),
        ...(isi && { isi }),
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
      data: thread,
      message: "Thread berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating thread:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui thread" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus thread
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if thread exists and user is owner
    const existingThread = await prisma.thread.findUnique({
      where: { thread_id: threadId },
      include: {
        mahasiswa: {
          include: {
            pengguna: true,
          },
        },
      },
    });

    if (!existingThread) {
      return NextResponse.json(
        { success: false, message: "Thread tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check ownership or admin
    const pengguna = await prisma.pengguna.findUnique({
      where: { email: session.user.email! },
    });

    if (
      existingThread.mahasiswa.pengguna.email !== session.user.email &&
      pengguna?.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda tidak memiliki akses untuk menghapus thread ini",
        },
        { status: 403 }
      );
    }

    // Delete thread (will cascade delete comments)
    await prisma.thread.delete({
      where: { thread_id: threadId },
    });

    return NextResponse.json({
      success: true,
      message: "Thread berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting thread:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus thread" },
      { status: 500 }
    );
  }
}
