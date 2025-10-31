// app/api/admin/mentor/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { authOptions } from "../../../auth/[...nextauth]/route";

// Validation Schema
const updateMentorSchema = z.object({
  nama: z.string().min(3).max(100).optional(),
  bio: z.string().min(10).optional(),
  keahlian: z.string().min(3).max(255).optional(),
  foto: z.string().optional().nullable(),
  email_kontak: z.string().email().max(100).optional(),
  linkedin: z.string().url().optional().nullable(),
  status: z.enum(["aktif", "nonaktif"]).optional(),
});

// GET - Get Single Mentor Detail
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const params = await context.params;
    const mentorId = parseInt(params.id);

    console.log("GET Request - Params ID:", params.id);
    console.log("GET Request - Parsed ID:", mentorId);

    if (isNaN(mentorId) || mentorId <= 0) {
      return NextResponse.json(
        { error: "ID mentor tidak valid" },
        { status: 400 }
      );
    }

    const mentor = await prisma.mentor.findUnique({
      where: { mentor_id: mentorId },
      include: {
        administrator: {
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

    if (!mentor) {
      return NextResponse.json(
        { error: "Profil mentor tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        mentor_id: mentor.mentor_id, // ✅ Gunakan mentor_id bukan id
        nama: mentor.nama,
        bio: mentor.bio,
        keahlian: mentor.keahlian,
        foto: mentor.foto,
        email_kontak: mentor.email_kontak,
        linkedin: mentor.linkedin,
        status: mentor.status,
        created_by: {
          id: mentor.administrator.admin_id,
          nama: mentor.administrator.pengguna.nama_lengkap,
          email: mentor.administrator.pengguna.email,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching mentor:", error);
    return NextResponse.json(
      { error: "Gagal memuat detail mentor" },
      { status: 500 }
    );
  }
}

// PATCH - Update Mentor Profile
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak: Anda bukan administrator" },
        { status: 403 }
      );
    }

    const params = await context.params;
    const mentorId = parseInt(params.id);

    console.log("PATCH Request - Params ID:", params.id); // Debug log
    console.log("PATCH Request - Parsed ID:", mentorId); // Debug log

    if (isNaN(mentorId) || mentorId <= 0) {
      return NextResponse.json(
        { error: "ID mentor tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("PATCH Request - Body:", body); // Debug log

    const validatedData = updateMentorSchema.parse(body);
    console.log("PATCH Request - Validated Data:", validatedData); // Debug log

    // Check if mentor exists
    const existingMentor = await prisma.mentor.findUnique({
      where: { mentor_id: mentorId },
    });

    console.log("PATCH Request - Existing Mentor:", existingMentor); // Debug log

    if (!existingMentor) {
      return NextResponse.json(
        { error: "Profil mentor tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check duplicate email if email is being updated
    if (
      validatedData.email_kontak &&
      validatedData.email_kontak !== existingMentor.email_kontak
    ) {
      const duplicateEmail = await prisma.mentor.findFirst({
        where: {
          email_kontak: validatedData.email_kontak,
          mentor_id: { not: mentorId },
        },
      });

      if (duplicateEmail) {
        return NextResponse.json(
          { error: "Email sudah digunakan oleh mentor lain" },
          { status: 400 }
        );
      }
    }

    // Build update data - only include fields that are provided
    const updateData: Record<string, unknown> = {};

    if (validatedData.nama !== undefined) updateData.nama = validatedData.nama;
    if (validatedData.bio !== undefined) updateData.bio = validatedData.bio;
    if (validatedData.keahlian !== undefined)
      updateData.keahlian = validatedData.keahlian;
    if (validatedData.foto !== undefined)
      updateData.foto = validatedData.foto || null;
    if (validatedData.email_kontak !== undefined)
      updateData.email_kontak = validatedData.email_kontak;
    if (validatedData.linkedin !== undefined)
      updateData.linkedin = validatedData.linkedin || null;
    if (validatedData.status !== undefined)
      updateData.status = validatedData.status;

    // Update mentor
    const updatedMentor = await prisma.mentor.update({
      where: { mentor_id: mentorId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Profil mentor berhasil diperbarui",
      data: {
        mentor_id: updatedMentor.mentor_id, // ✅ Gunakan mentor_id bukan id
        nama: updatedMentor.nama,
        bio: updatedMentor.bio,
        keahlian: updatedMentor.keahlian,
        foto: updatedMentor.foto,
        email_kontak: updatedMentor.email_kontak,
        linkedin: updatedMentor.linkedin,
        status: updatedMentor.status,
      },
    });
  } catch (error) {
    console.error("Error updating mentor:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Data yang diinput tidak valid",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui profil mentor" },
      { status: 500 }
    );
  }
}

// DELETE - Delete Mentor Profile
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak: Anda bukan administrator" },
        { status: 403 }
      );
    }

    const params = await context.params;
    const mentorId = parseInt(params.id);

    console.log("DELETE Request - Params ID:", params.id); // Debug log
    console.log("DELETE Request - Parsed ID:", mentorId); // Debug log

    if (isNaN(mentorId) || mentorId <= 0) {
      return NextResponse.json(
        { error: "ID mentor tidak valid" },
        { status: 400 }
      );
    }

    // Check if mentor exists
    const mentor = await prisma.mentor.findUnique({
      where: { mentor_id: mentorId },
    });

    if (!mentor) {
      return NextResponse.json(
        { error: "Profil mentor tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete mentor
    await prisma.mentor.delete({
      where: { mentor_id: mentorId },
    });

    return NextResponse.json({
      success: true,
      message: "Profil mentor berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting mentor:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus profil mentor" },
      { status: 500 }
    );
  }
}
