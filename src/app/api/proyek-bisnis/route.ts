import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Ambil semua proyek bisnis mahasiswa yang login
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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

    const proyekBisnis = await prisma.proyekBisnis.findMany({
      where: { mahasiswa_id: mahasiswa.mahasiswa_id },
      orderBy: { proyek_id: "desc" },
    });

    return NextResponse.json(proyekBisnis);
  } catch (error) {
    console.error("Error fetching proyek bisnis:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Buat proyek bisnis baru
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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

    const body = await req.json();
    const { nama_proyek, deskripsi, status_proyek, dokumen } = body;

    if (!nama_proyek || !status_proyek) {
      return NextResponse.json(
        { error: "nama_proyek and status_proyek are required" },
        { status: 400 }
      );
    }

    const newProyek = await prisma.proyekBisnis.create({
      data: {
        mahasiswa_id: mahasiswa.mahasiswa_id,
        nama_proyek,
        deskripsi: deskripsi || null,
        status_proyek,
        dokumen: dokumen || null,
      },
    });

    return NextResponse.json(newProyek, { status: 201 });
  } catch (error) {
    console.error("Error creating proyek bisnis:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
