import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Ambil detail proyek bisnis
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const proyekId = parseInt(resolvedParams.id);

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
      return NextResponse.json({ error: "Proyek not found" }, { status: 404 });
    }

    return NextResponse.json(proyek);
  } catch (error) {
    console.error("Error fetching proyek detail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update proyek bisnis
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { user_id: Number(session.user.id) },
    });

    if (!mahasiswa) {
      return NextResponse.json(
        { error: "Mahasiswa not found" },
        { status: 404 }
      );
    }

    const resolvedParams = await params;
    const proyekId = parseInt(resolvedParams.id);

    // Cek ownership
    const existingProyek = await prisma.proyekBisnis.findUnique({
      where: { proyek_id: proyekId },
    });

    if (!existingProyek) {
      return NextResponse.json({ error: "Proyek not found" }, { status: 404 });
    }

    if (existingProyek.mahasiswa_id !== mahasiswa.mahasiswa_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { nama_proyek, deskripsi, status_proyek, dokumen } = body;

    const updatedProyek = await prisma.proyekBisnis.update({
      where: { proyek_id: proyekId },
      data: {
        ...(nama_proyek && { nama_proyek }),
        ...(deskripsi !== undefined && { deskripsi }),
        ...(status_proyek && { status_proyek }),
        ...(dokumen !== undefined && { dokumen }),
      },
    });

    return NextResponse.json(updatedProyek);
  } catch (error) {
    console.error("Error updating proyek:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus proyek bisnis
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { user_id: Number(session.user.id) },
    });

    if (!mahasiswa) {
      return NextResponse.json(
        { error: "Mahasiswa not found" },
        { status: 404 }
      );
    }

    const resolvedParams = await params;
    const proyekId = parseInt(resolvedParams.id);

    // Cek ownership
    const existingProyek = await prisma.proyekBisnis.findUnique({
      where: { proyek_id: proyekId },
    });

    if (!existingProyek) {
      return NextResponse.json({ error: "Proyek not found" }, { status: 404 });
    }

    if (existingProyek.mahasiswa_id !== mahasiswa.mahasiswa_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.proyekBisnis.delete({
      where: { proyek_id: proyekId },
    });

    return NextResponse.json({ message: "Proyek deleted successfully" });
  } catch (error) {
    console.error("Error deleting proyek:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
