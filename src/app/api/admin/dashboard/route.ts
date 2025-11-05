// app/api/admin/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Statistik Umum
    const [
      totalMahasiswa,
      totalKursus,
      totalMentor,
      totalThread,
      totalProyek,
      kursusAktif,
      mahasiswaAktif,
    ] = await Promise.all([
      prisma.mahasiswa.count(),
      prisma.kursus.count(),
      prisma.mentor.count({ where: { status: "aktif" } }),
      prisma.thread.count(),
      prisma.proyekBisnis.count(),
      prisma.kursus.count({ where: { status: "published" } }),
      prisma.enrollment.count({ where: { status: "ongoing" } }),
    ]);

    // Enrollment per bulan (6 bulan terakhir)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const enrollmentTrend = await prisma.enrollment.groupBy({
      by: ["tanggal_mulai"],
      _count: { enrollment_id: true },
      where: {
        tanggal_mulai: { gte: sixMonthsAgo },
      },
      orderBy: { tanggal_mulai: "asc" },
    });

    const monthlyEnrollments = enrollmentTrend.reduce((acc, item) => {
      const month = new Date(item.tanggal_mulai).toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      });
      acc[month] = (acc[month] || 0) + item._count.enrollment_id;
      return acc;
    }, {} as Record<string, number>);

    // Distribusi kursus berdasarkan level
    const kursusPerLevel = await prisma.kursus.groupBy({
      by: ["level"],
      _count: { kursus_id: true },
    });

    // Top 5 kursus berdasarkan enrollment
    const topKursus = await prisma.kursus.findMany({
      select: {
        judul: true,
        kategori: true,
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: {
        enrollments: { _count: "desc" },
      },
      take: 5,
    });

    // Distribusi status proyek bisnis
    const proyekPerStatus = await prisma.proyekBisnis.groupBy({
      by: ["status_proyek"],
      _count: { proyek_id: true },
    });

    // Tingkat penyelesaian kursus
    const completionRate = await prisma.enrollment.groupBy({
      by: ["status"],
      _count: { enrollment_id: true },
    });

    const totalEnrollments = completionRate.reduce(
      (sum, item) => sum + item._count.enrollment_id,
      0
    );
    const completedEnrollments =
      completionRate.find((item) => item.status === "completed")?._count
        .enrollment_id || 0;
    const completionPercentage =
      totalEnrollments > 0
        ? ((completedEnrollments / totalEnrollments) * 100).toFixed(1)
        : "0";

    // Thread paling banyak dilihat (top 5)
    const topThreads = await prisma.thread.findMany({
      select: {
        judul: true,
        jumlah_views: true,
        jumlah_komentar: true,
        mahasiswa: {
          select: {
            pengguna: {
              select: { nama_lengkap: true },
            },
          },
        },
      },
      orderBy: { jumlah_views: "desc" },
      take: 5,
    });

    // Aktivitas terbaru
    const recentActivities = await prisma.enrollment.findMany({
      select: {
        enrollment_id: true,
        tanggal_mulai: true,
        mahasiswa: {
          select: {
            pengguna: { select: { nama_lengkap: true } },
          },
        },
        kursus: {
          select: { judul: true },
        },
      },
      orderBy: { tanggal_mulai: "desc" },
      take: 10,
    });

    return NextResponse.json({
      stats: {
        totalMahasiswa,
        totalKursus,
        totalMentor,
        totalThread,
        totalProyek,
        kursusAktif,
        mahasiswaAktif,
        completionRate: completionPercentage,
      },
      charts: {
        enrollmentTrend: Object.entries(monthlyEnrollments).map(
          ([month, count]) => ({ month, count })
        ),
        kursusPerLevel: kursusPerLevel.map((item) => ({
          level: item.level,
          count: item._count.kursus_id,
        })),
        topKursus: topKursus.map((kursus) => ({
          judul: kursus.judul,
          kategori: kursus.kategori,
          enrollments: kursus._count.enrollments,
        })),
        proyekPerStatus: proyekPerStatus.map((item) => ({
          status: item.status_proyek,
          count: item._count.proyek_id,
        })),
        enrollmentStatus: completionRate.map((item) => ({
          status: item.status,
          count: item._count.enrollment_id,
        })),
      },
      activities: {
        topThreads: topThreads.map((thread) => ({
          judul: thread.judul,
          views: thread.jumlah_views,
          komentar: thread.jumlah_komentar,
          author: thread.mahasiswa.pengguna.nama_lengkap,
        })),
        recentEnrollments: recentActivities.map((activity) => ({
          id: activity.enrollment_id,
          mahasiswa: activity.mahasiswa.pengguna.nama_lengkap,
          kursus: activity.kursus.judul,
          tanggal: activity.tanggal_mulai.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
