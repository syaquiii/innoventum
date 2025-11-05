// app/admin/kursus/hooks/useAdminMateri.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface Materi {
  materi_id: number;
  kursus_id: number;
  judul_materi: string;
  urutan: number;
  tipe_konten: "video" | "dokumen" | "latihan";
  url_konten: string;
  durasi_menit: number | null;
  kursus: {
    kursus_id: number;
    judul: string;
    kategori: string;
  };
}

export interface MateriFilters {
  page?: number;
  limit?: number;
  search?: string;
  kursus_id?: string;
  tipe_konten?: string;
}

export interface CreateMateriData {
  kursus_id: number;
  judul_materi: string;
  urutan: number;
  tipe_konten: "video" | "dokumen" | "latihan";
  url_konten: string;
  durasi_menit?: number;
}

export interface UpdateMateriData {
  kursus_id?: number;
  judul_materi?: string;
  urutan?: number;
  tipe_konten?: "video" | "dokumen" | "latihan";
  url_konten?: string;
  durasi_menit?: number | null;
}

interface MateriResponse {
  success: boolean;
  data: Materi[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface MateriDetailResponse {
  success: boolean;
  data: Materi;
}

// Fetch all materi with filters
export function useAdminMateri(filters: MateriFilters) {
  return useQuery<MateriResponse>({
    queryKey: ["admin-materi", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.kursus_id) params.append("kursus_id", filters.kursus_id);
      if (filters.tipe_konten)
        params.append("tipe_konten", filters.tipe_konten);

      const response = await fetch(`/api/admin/materi?${params}`);
      if (!response.ok) throw new Error("Failed to fetch materi");
      const data = await response.json();
      return data;
    },
  });
}

// Fetch single materi by ID
export function useAdminMateriDetail(materiId: number | null) {
  return useQuery<MateriDetailResponse>({
    queryKey: ["admin-materi-detail", materiId],
    queryFn: async () => {
      if (!materiId) throw new Error("Materi ID is required");
      const response = await fetch(`/api/admin/materi/${materiId}`);
      if (!response.ok) throw new Error("Failed to fetch materi detail");
      const data = await response.json();
      return data;
    },
    enabled: !!materiId,
  });
}

// Create materi
export function useCreateMateri() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (materiData: CreateMateriData) => {
      const response = await fetch("/api/admin/materi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materiData),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.error || "Failed to create materi");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-materi"] });
      queryClient.invalidateQueries({ queryKey: ["admin-kursus"] });
    },
  });
}

// Update materi
export function useUpdateMateri() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      materiId,
      data,
    }: {
      materiId: number;
      data: UpdateMateriData;
    }) => {
      const response = await fetch(`/api/admin/materi/${materiId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.error || "Failed to update materi");
      }
      const responseData = await response.json();
      return responseData;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-materi"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-materi-detail", variables.materiId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-kursus"] });
    },
  });
}

// Delete materi
export function useDeleteMateri() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (materiId: number) => {
      const response = await fetch(`/api/admin/materi/${materiId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.error || "Failed to delete materi");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-materi"] });
      queryClient.invalidateQueries({ queryKey: ["admin-kursus"] });
    },
  });
}
