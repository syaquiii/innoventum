import { useState, useEffect } from "react";

export interface DashboardStats {
  totalMahasiswa: number;
  totalKursus: number;
  totalMentor: number;
  totalThread: number;
  totalProyek: number;
  kursusAktif: number;
  mahasiswaAktif: number;
  completionRate: string;
}

export interface EnrollmentTrend {
  month: string;
  count: number;
}

export interface KursusLevel {
  level: string;
  count: number;
  [key: string]: string | number; // Lebih type-safe dari 'any'
}

export interface TopKursus {
  judul: string;
  kategori: string;
  enrollments: number;
}

export interface ProyekStatus {
  status: string;
  count: number;
}

export interface EnrollmentStatus {
  status: string;
  count: number;
}

export interface TopThread {
  judul: string;
  views: number;
  komentar: number;
  author: string;
}

export interface RecentEnrollment {
  id: number;
  mahasiswa: string;
  kursus: string;
  tanggal: string;
}

export interface DashboardData {
  stats: DashboardStats;
  charts: {
    enrollmentTrend: EnrollmentTrend[];
    kursusPerLevel: KursusLevel[];
    topKursus: TopKursus[];
    proyekPerStatus: ProyekStatus[];
    enrollmentStatus: EnrollmentStatus[];
  };
  activities: {
    topThreads: TopThread[];
    recentEnrollments: RecentEnrollment[];
  };
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) throw new Error("Failed to fetch");
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}
