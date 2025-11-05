// hooks/useAdminKursus.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface KursusFilters {
  page?: number;
  limit?: number;
  search?: string;
  kategori?: string;
  level?: "beginner" | "intermediate" | "advanced" | "";
  status?: "draft" | "published" | "archived" | "";
}

export interface CreateKursusData {
  judul: string;
  deskripsi: string;
  kategori: string;
  thumbnail?: string;
  durasi_menit: number;
  level: "beginner" | "intermediate" | "advanced";
  status: "draft" | "published" | "archived";
}

export interface UpdateKursusData {
  judul?: string;
  deskripsi?: string;
  kategori?: string;
  thumbnail?: string;
  durasi_menit?: number;
  level?: "beginner" | "intermediate" | "advanced";
  status?: "draft" | "published" | "archived";
}

export interface Kursus {
  kursus_id: number;
  judul: string;
  deskripsi: string;
  kategori: string;
  thumbnail: string | null;
  durasi_menit: number;
  level: "beginner" | "intermediate" | "advanced";
  status: "draft" | "published" | "archived";
  created_by: number;
  administrator: {
    admin_id: number;
    pengguna: {
      nama_lengkap: string;
    };
  };
  _count: {
    enrollments: number;
    materi: number;
  };
}

interface KursusResponse {
  data: Kursus[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface KursusDetailResponse {
  data: Kursus;
}

// Fetch list kursus
export function useAdminKursus(filters: KursusFilters) {
  return useQuery<KursusResponse>({
    queryKey: ["admin-kursus", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.kategori) params.append("kategori", filters.kategori);
      if (filters.level) params.append("level", filters.level);
      if (filters.status) params.append("status", filters.status);

      const response = await fetch(`/api/admin/kursus?${params.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch kursus");
      }
      return response.json();
    },
  });
}

// Fetch single kursus
export function useAdminKursusDetail(kursusId: number | null) {
  return useQuery<KursusDetailResponse>({
    queryKey: ["admin-kursus", kursusId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/kursus/${kursusId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch kursus");
      }
      return response.json();
    },
    enabled: !!kursusId,
  });
}

// Create kursus
export function useCreateKursus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateKursusData) => {
      const response = await fetch("/api/admin/kursus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create kursus");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-kursus"] });
    },
  });
}

// Update kursus
export function useUpdateKursus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      kursusId,
      data,
    }: {
      kursusId: number;
      data: UpdateKursusData;
    }) => {
      const response = await fetch(`/api/admin/kursus/${kursusId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update kursus");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-kursus"] });
    },
  });
}

// Delete kursus
export function useDeleteKursus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (kursusId: number) => {
      const response = await fetch(`/api/admin/kursus/${kursusId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete kursus");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-kursus"] });
    },
  });
}
