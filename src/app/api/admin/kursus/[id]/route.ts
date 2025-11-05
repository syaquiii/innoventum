import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Extracts the ID from the request URL as a workaround for params bug.
 * @param req The NextRequest object
 * @returns A number or null if the ID is invalid
 */
function getIdFromRequest(req: NextRequest): number | null {
  const idFromUrl = req.nextUrl.pathname.split("/").pop();
  if (!idFromUrl) {
    return null;
  }
  const id = parseInt(idFromUrl);
  if (isNaN(id)) {
    return null;
  }
  return id;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } } // Keep signature for type safety, but don't rely on it
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FIX: Get ID from URL instead of params object
    const kursusId = getIdFromRequest(req);

    if (kursusId === null) {
      return NextResponse.json(
        { error: "Invalid or missing Kursus ID" },
        { status: 400 }
      );
    }

    const kursus = await prisma.kursus.findUnique({
      where: { kursus_id: kursusId },
      include: {
        administrator: {
          include: {
            pengguna: {
              select: {
                nama_lengkap: true,
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            materi: true,
          },
        },
      },
    });

    if (!kursus) {
      return NextResponse.json(
        { error: "Kursus tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: kursus });
  } catch (error) {
    console.error("Error fetching kursus detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } } // Keep signature for type safety
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FIX: Get ID from URL instead of params object
    const kursusId = getIdFromRequest(req);

    if (kursusId === null) {
      return NextResponse.json(
        { error: "Invalid or missing Kursus ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Check if kursus exists
    const existingKursus = await prisma.kursus.findUnique({
      where: { kursus_id: kursusId },
    });

    if (!existingKursus) {
      return NextResponse.json(
        { error: "Kursus tidak ditemukan" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (body.judul) updateData.judul = body.judul;
    if (body.deskripsi) updateData.deskripsi = body.deskripsi;
    if (body.kategori) updateData.kategori = body.kategori;
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail;
    if (body.durasi_menit)
      updateData.durasi_menit = parseInt(body.durasi_menit);
    if (body.level) updateData.level = body.level;
    if (body.status) updateData.status = body.status;

    const updatedKursus = await prisma.kursus.update({
      where: { kursus_id: kursusId },
      data: updateData,
      include: {
        administrator: {
          include: {
            pengguna: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Kursus berhasil diperbarui",
      data: updatedKursus,
    });
  } catch (error) {
    console.error("Error updating kursus:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } } // Keep signature for type safety
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FIX: Get ID from URL instead of params object
    const kursusId = getIdFromRequest(req);

    if (kursusId === null) {
      return NextResponse.json(
        { error: "Invalid or missing Kursus ID" },
        { status: 400 }
      );
    }

    // Check if kursus exists
    const existingKursus = await prisma.kursus.findUnique({
      where: { kursus_id: kursusId },
      include: {
        _count: {
          select: {
            enrollments: true,
            materi: true,
          },
        },
      },
    });

    if (!existingKursus) {
      return NextResponse.json(
        { error: "Kursus tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if there are enrollments or materi
    if (existingKursus._count.enrollments > 0) {
      return NextResponse.json(
        {
          error: "Tidak dapat menghapus kursus yang sudah memiliki enrollment",
        },
        { status: 400 }
      );
    }

    // Delete materi first if exists
    if (existingKursus._count.materi > 0) {
      await prisma.materi.deleteMany({
        where: { kursus_id: kursusId },
      });
    }

    // Delete kursus
    await prisma.kursus.delete({
      where: { kursus_id: kursusId },
    });

    return NextResponse.json({
      message: "Kursus berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting kursus:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
