// app/api/admin/proyek/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET single proyek by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const proyekId = parseInt(id);

    if (isNaN(proyekId)) {
      return NextResponse.json(
        { error: "ID proyek tidak valid" },
        { status: 400 }
      );
    }

    const proyek = await prisma.proyekBisnis.findUnique({
      where: { proyek_id: proyekId },
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

    if (!proyek) {
      return NextResponse.json(
        { error: "Proyek tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: proyek,
    });
  } catch (error) {
    console.error("Error fetching proyek:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update proyek by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const proyekId = parseInt(id);

    if (isNaN(proyekId)) {
      return NextResponse.json(
        { error: "ID proyek tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { mahasiswa_id, nama_proyek, deskripsi, status_proyek, dokumen } =
      body;

    // Check if proyek exists
    const existingProyek = await prisma.proyekBisnis.findUnique({
      where: { proyek_id: proyekId },
    });

    if (!existingProyek) {
      return NextResponse.json(
        { error: "Proyek tidak ditemukan" },
        { status: 404 }
      );
    }

    // If mahasiswa_id is being updated, check if new mahasiswa exists
    if (mahasiswa_id && mahasiswa_id !== existingProyek.mahasiswa_id) {
      const mahasiswa = await prisma.mahasiswa.findUnique({
        where: { mahasiswa_id: parseInt(mahasiswa_id) },
      });

      if (!mahasiswa) {
        return NextResponse.json(
          { error: "Mahasiswa tidak ditemukan" },
          { status: 404 }
        );
      }
    }

    // Build update data object
    const updateData: any = {};
    if (mahasiswa_id !== undefined)
      updateData.mahasiswa_id = parseInt(mahasiswa_id);
    if (nama_proyek !== undefined) updateData.nama_proyek = nama_proyek;
    if (deskripsi !== undefined) updateData.deskripsi = deskripsi || null;
    if (status_proyek !== undefined) updateData.status_proyek = status_proyek;
    if (dokumen !== undefined) updateData.dokumen = dokumen || null;

    const updatedProyek = await prisma.proyekBisnis.update({
      where: { proyek_id: proyekId },
      data: updateData,
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
      message: "Proyek berhasil diupdate",
      data: updatedProyek,
    });
  } catch (error) {
    console.error("Error updating proyek:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE proyek by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const proyekId = parseInt(id);

    if (isNaN(proyekId)) {
      return NextResponse.json(
        { error: "ID proyek tidak valid" },
        { status: 400 }
      );
    }

    // Check if proyek exists
    const proyek = await prisma.proyekBisnis.findUnique({
      where: { proyek_id: proyekId },
    });

    if (!proyek) {
      return NextResponse.json(
        { error: "Proyek tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.proyekBisnis.delete({
      where: { proyek_id: proyekId },
    });

    return NextResponse.json({
      success: true,
      message: "Proyek berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting proyek:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
