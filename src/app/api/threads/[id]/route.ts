// app/api/threads/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Ambil detail thread
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const threadId = parseInt(id);

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
          orderBy: { tanggal_dibuat: "asc" },
        },
      },
    });

    if (!thread) {
      return NextResponse.json(
        { success: false, error: "Thread tidak ditemukan" },
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
    console.error("Error fetching thread:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch thread" },
      { status: 500 }
    );
  }
}

// PATCH - Update thread
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const threadId = parseInt(params.id);
    const body = await req.json();
    const { judul, isi } = body;

    // Cek kepemilikan thread
    const thread = await prisma.thread.findUnique({
      where: { thread_id: threadId },
      include: {
        mahasiswa: true,
      },
    });

    if (!thread) {
      return NextResponse.json(
        { success: false, error: "Thread tidak ditemukan" },
        { status: 404 }
      );
    }

    if (String(thread.mahasiswa.user_id) !== String(session.user.id)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const updatedThread = await prisma.thread.update({
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
      data: updatedThread,
    });
  } catch (error) {
    console.error("Error updating thread:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update thread" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus thread
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const threadId = parseInt(params.id);

    // Cek kepemilikan thread
    const thread = await prisma.thread.findUnique({
      where: { thread_id: threadId },
      include: {
        mahasiswa: true,
      },
    });

    if (!thread) {
      return NextResponse.json(
        { success: false, error: "Thread tidak ditemukan" },
        { status: 404 }
      );
    }

    if (String(thread.mahasiswa.user_id) !== String(session.user.id)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Hapus semua komentar dulu
    await prisma.komentar.deleteMany({
      where: { thread_id: threadId },
    });

    // Hapus thread
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
      { success: false, error: "Failed to delete thread" },
      { status: 500 }
    );
  }
}
