// hooks/useProyekBisnis.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StatusProyek } from "@prisma/client";

export interface ProyekBisnis {
  proyek_id: number;
  mahasiswa_id: number;
  nama_proyek: string;
  deskripsi: string | null;
  status_proyek: StatusProyek;
  dokumen: string | null;
}

export interface CreateProyekInput {
  nama_proyek: string;
  deskripsi?: string;
  status_proyek: StatusProyek;
  dokumen?: string;
}

export interface UpdateProyekInput {
  nama_proyek?: string;
  deskripsi?: string;
  status_proyek?: StatusProyek;
  dokumen?: string;
}

// Fetch all proyek bisnis
export function useProyekBisnisList() {
  return useQuery<ProyekBisnis[]>({
    queryKey: ["proyek-bisnis"],
    queryFn: async () => {
      const res = await fetch("/api/proyek-bisnis");
      if (!res.ok) throw new Error("Failed to fetch proyek bisnis");
      return res.json();
    },
  });
}

// Fetch single proyek bisnis
export function useProyekBisnis(proyekId: number) {
  return useQuery<ProyekBisnis>({
    queryKey: ["proyek-bisnis", proyekId],
    queryFn: async () => {
      const res = await fetch(`/api/proyek-bisnis/${proyekId}`);
      if (!res.ok) throw new Error("Failed to fetch proyek detail");
      return res.json();
    },
    enabled: !!proyekId,
  });
}

// Create proyek bisnis
export function useCreateProyekBisnis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProyekInput) => {
      const res = await fetch("/api/proyek-bisnis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create proyek");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyek-bisnis"] });
    },
  });
}

// Update proyek bisnis
export function useUpdateProyekBisnis(proyekId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProyekInput) => {
      const res = await fetch(`/api/proyek-bisnis/${proyekId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update proyek");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyek-bisnis"] });
      queryClient.invalidateQueries({ queryKey: ["proyek-bisnis", proyekId] });
    },
  });
}

// Delete proyek bisnis
export function useDeleteProyekBisnis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proyekId: number) => {
      const res = await fetch(`/api/proyek-bisnis/${proyekId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete proyek");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyek-bisnis"] });
    },
  });
}
