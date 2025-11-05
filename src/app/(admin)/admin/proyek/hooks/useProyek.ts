// hooks/useAdminProyek.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface ProyekFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "" | "ideas" | "perencanaan" | "eksekusi" | "selesai";
  mahasiswa_id?: string;
}

export interface CreateProyekData {
  mahasiswa_id: number;
  nama_proyek: string;
  deskripsi?: string;
  status_proyek: "ideas" | "perencanaan" | "eksekusi" | "selesai";
  dokumen?: string;
}

export interface UpdateProyekData {
  mahasiswa_id?: number;
  nama_proyek?: string;
  deskripsi?: string;
  status_proyek?: "ideas" | "perencanaan" | "eksekusi" | "selesai";
  dokumen?: string;
}

export interface Proyek {
  proyek_id: number;
  mahasiswa_id: number;
  nama_proyek: string;
  deskripsi: string | null;
  status_proyek: string;
  dokumen: string | null;
  mahasiswa: {
    mahasiswa_id: number;
    nim: string;
    institusi: string;
    program_studi: string;
    pengguna: {
      nama_lengkap: string;
      email: string;
    };
  };
}

interface ProyekResponse {
  success: boolean;
  data: Proyek[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ProyekDetailResponse {
  success: boolean;
  data: Proyek;
}

// Fetch all proyek with filters
const fetchProyek = async (filters: ProyekFilters): Promise<ProyekResponse> => {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  if (filters.mahasiswa_id) params.append("mahasiswa_id", filters.mahasiswa_id);

  const response = await fetch(`/api/admin/proyek?${params.toString()}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch proyek");
  }
  return response.json();
};

// Fetch single proyek
const fetchProyekDetail = async (
  proyekId: number | null
): Promise<ProyekDetailResponse> => {
  if (!proyekId) throw new Error("Proyek ID is required");

  const response = await fetch(`/api/admin/proyek/${proyekId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch proyek detail");
  }
  return response.json();
};

// Create proyek
const createProyek = async (
  data: CreateProyekData
): Promise<ProyekDetailResponse> => {
  const response = await fetch("/api/admin/proyek", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create proyek");
  }
  return response.json();
};

// Update proyek
const updateProyek = async ({
  proyekId,
  data,
}: {
  proyekId: number;
  data: UpdateProyekData;
}): Promise<ProyekDetailResponse> => {
  const response = await fetch(`/api/admin/proyek/${proyekId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update proyek");
  }
  return response.json();
};

// Delete proyek
const deleteProyek = async (proyekId: number): Promise<void> => {
  const response = await fetch(`/api/admin/proyek/${proyekId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete proyek");
  }
};

// Hooks
export const useAdminProyek = (filters: ProyekFilters) => {
  return useQuery({
    queryKey: ["adminProyek", filters],
    queryFn: () => fetchProyek(filters),
  });
};

export const useAdminProyekDetail = (proyekId: number | null) => {
  return useQuery({
    queryKey: ["adminProyek", proyekId],
    queryFn: () => fetchProyekDetail(proyekId),
    enabled: !!proyekId,
  });
};

export const useCreateProyek = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProyek,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProyek"] });
    },
  });
};

export const useUpdateProyek = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProyek,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProyek"] });
    },
  });
};

export const useDeleteProyek = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProyek,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProyek"] });
    },
  });
};
