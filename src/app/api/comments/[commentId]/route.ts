import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// PATCH - Update komentar
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Await params untuk Next.js 15
    const { commentId } = await params;
    const komentarId = parseInt(commentId);

    const body = await req.json();
    const { isi_komentar } = body;

    // Cek kepemilikan komentar
    const komentar = await prisma.komentar.findUnique({
      where: { komentar_id: komentarId },
      include: {
        mahasiswa: true,
      },
    });

    if (!komentar) {
      return NextResponse.json(
        { success: false, error: "Komentar tidak ditemukan" },
        { status: 404 }
      );
    }

    if (String(komentar.mahasiswa.user_id) !== String(session.user.id)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const updatedKomentar = await prisma.komentar.update({
      where: { komentar_id: komentarId },
      data: { isi_komentar },
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
      data: updatedKomentar,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus komentar
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Await params untuk Next.js 15
    const { commentId } = await params;
    const komentarId = parseInt(commentId);

    // Cek kepemilikan komentar
    const komentar = await prisma.komentar.findUnique({
      where: { komentar_id: komentarId },
      include: {
        mahasiswa: true,
      },
    });

    if (!komentar) {
      return NextResponse.json(
        { success: false, error: "Komentar tidak ditemukan" },
        { status: 404 }
      );
    }

    if (String(komentar.mahasiswa.user_id) !== String(session.user.id)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Hapus komentar dan update jumlah_komentar thread
    await prisma.$transaction([
      prisma.komentar.delete({
        where: { komentar_id: komentarId },
      }),
      prisma.thread.update({
        where: { thread_id: komentar.thread_id },
        data: { jumlah_komentar: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Komentar berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
