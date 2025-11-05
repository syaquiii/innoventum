// app/api/admin/materi/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params seperti yang disarankan oleh error
    const resolvedParams = await params;

    // Validasi ID
    const materiId = parseInt(resolvedParams.id); // Gunakan resolvedParams
    if (isNaN(materiId)) {
      return NextResponse.json(
        { error: "Invalid Materi ID format" },
        { status: 400 }
      );
    }

    const materi = await prisma.materi.findUnique({
      where: { materi_id: materiId }, // Gunakan ID yang sudah divalidasi
      include: {
        kursus: {
          select: {
            kursus_id: true,
            judul: true,
            kategori: true,
          },
        },
      },
    });

    if (!materi) {
      return NextResponse.json({ error: "Materi not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: materi,
    });
  } catch (error) {
    console.error("Error fetching materi:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params seperti yang disarankan oleh error
    const resolvedParams = await params;

    // Validasi ID
    const materiId = parseInt(resolvedParams.id); // Gunakan resolvedParams
    if (isNaN(materiId)) {
      return NextResponse.json(
        { error: "Invalid Materi ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      kursus_id,
      judul_materi,
      urutan,
      tipe_konten,
      url_konten,
      durasi_menit,
    } = body;

    // Cek apakah materi exists
    const existingMateri = await prisma.materi.findUnique({
      where: { materi_id: materiId }, // Gunakan ID yang sudah divalidasi
    });

    if (!existingMateri) {
      return NextResponse.json({ error: "Materi not found" }, { status: 404 });
    }

    // Jika urutan diubah, cek apakah urutan baru sudah digunakan
    if (urutan !== undefined && urutan !== existingMateri.urutan) {
      const conflictMateri = await prisma.materi.findFirst({
        where: {
          kursus_id: kursus_id ? parseInt(kursus_id) : existingMateri.kursus_id,
          urutan: parseInt(urutan),
          materi_id: { not: materiId }, // Gunakan ID yang sudah divalidasi
        },
      });

      if (conflictMateri) {
        return NextResponse.json(
          { error: "Urutan sudah digunakan untuk kursus ini" },
          { status: 400 }
        );
      }
    }

    const updatedMateri = await prisma.materi.update({
      where: { materi_id: materiId }, // Gunakan ID yang sudah divalidasi
      data: {
        ...(kursus_id && { kursus_id: parseInt(kursus_id) }),
        ...(judul_materi && { judul_materi }),
        ...(urutan !== undefined && { urutan: parseInt(urutan) }),
        ...(tipe_konten && { tipe_konten }),
        ...(url_konten && { url_konten }),
        ...(durasi_menit !== undefined && {
          durasi_menit: durasi_menit ? parseInt(durasi_menit) : null,
        }),
      },
      include: {
        kursus: {
          select: {
            kursus_id: true,
            judul: true,
            kategori: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedMateri,
      message: "Materi berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating materi:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params seperti yang disarankan oleh error
    const resolvedParams = await params;

    // Validasi ID
    const materiId = parseInt(resolvedParams.id); // Gunakan resolvedParams
    if (isNaN(materiId)) {
      return NextResponse.json(
        { error: "Invalid Materi ID format" },
        { status: 400 }
      );
    }

    const materi = await prisma.materi.findUnique({
      where: { materi_id: materiId }, // Gunakan ID yang sudah divalidasi
    });

    if (!materi) {
      return NextResponse.json({ error: "Materi not found" }, { status: 404 });
    }

    await prisma.materi.delete({
      where: { materi_id: materiId }, // Gunakan ID yang sudah divalidasi
    });

    return NextResponse.json({
      success: true,
      message: "Materi berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting materi:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
