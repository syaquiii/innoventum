import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server"; // 1. Import NextRequest

export async function GET(
  request: NextRequest, // 2. Use NextRequest instead of Request
  context: { params: Promise<{ id: string }> } // 3. Match the type from the error
) {
  try {
    // 4. Await the params promise to resolve and get the id
    const { id } = await context.params;

    // 5. Parse and validate the ID from context
    const mentorId = parseInt(id);

    if (isNaN(mentorId)) {
      console.error("Invalid Mentor ID from context params:", id);
      return NextResponse.json(
        { success: false, error: "Invalid Mentor ID. Must be a number." },
        { status: 400 } // 400 Bad Request
      );
    }

    // 6. Proceed with your Prisma query
    const mentor = await prisma.mentor.findUnique({
      where: {
        mentor_id: mentorId,
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
    });

    if (!mentor) {
      return NextResponse.json(
        { success: false, error: "Mentor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mentor,
    });
  } catch (error) {
    console.error("Error fetching mentor:", error);

    if (
      error instanceof Error &&
      (error as any).name === "PrismaClientValidationError"
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid query data" },
        { status: 400 }
      );
    }

    // Generic fallback error
    return NextResponse.json(
      { success: false, error: "Failed to fetch mentor" },
      { status: 500 }
    );
  }
}
