// app/api/mentor/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mentors = await prisma.mentor.findMany({
      where: {
        status: "aktif",
      },
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
      },
      orderBy: {
        mentor_id: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: mentors,
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mentors" },
      { status: 500 }
    );
  }
}
