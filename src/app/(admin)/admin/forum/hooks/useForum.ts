import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface ThreadFilters {
  page?: number;
  limit?: number;
  search?: string;
  mahasiswa_id?: string;
}

export interface CreateThreadData {
  judul: string;
  isi: string;
}

export interface UpdateThreadData {
  judul?: string;
  isi?: string;
}

export interface CreateKomentarData {
  isi_komentar: string;
}

export interface Thread {
  thread_id: number;
  mahasiswa_id: number;
  judul: string;
  isi: string;
  jumlah_views: number;
  jumlah_komentar: number;
  mahasiswa: {
    mahasiswa_id: number;
    nim: string;
    pengguna: {
      nama_lengkap: string;
      email: string;
    };
  };
  _count?: {
    komentar: number;
  };
}

export interface Komentar {
  komentar_id: number;
  thread_id: number;
  mahasiswa_id: number;
  isi_komentar: string;
  tanggal_dibuat: string;
  mahasiswa: {
    mahasiswa_id: number;
    nim: string;
    pengguna: {
      nama_lengkap: string;
      email: string;
    };
  };
}

export interface ThreadDetail extends Thread {
  komentar: Komentar[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Fetch all threads
export const useForum = (filters: ThreadFilters) => {
  return useQuery<ApiResponse<Thread[]>>({
    queryKey: ["forum", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.mahasiswa_id)
        params.append("mahasiswa_id", filters.mahasiswa_id);

      const response = await fetch(`/api/admin/forum?${params.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal mengambil data thread");
      }
      return response.json();
    },
  });
};

// Fetch thread detail
export const useThreadDetail = (threadId: number | null) => {
  return useQuery<ApiResponse<ThreadDetail>>({
    queryKey: ["forum", threadId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/forum/${threadId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal mengambil detail thread");
      }
      return response.json();
    },
    enabled: !!threadId,
  });
};

// Create thread
export const useCreateThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateThreadData) => {
      const response = await fetch("/api/admin/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal membuat thread");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum"] });
    },
  });
};

// Update thread
export const useUpdateThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      threadId,
      data,
    }: {
      threadId: number;
      data: UpdateThreadData;
    }) => {
      const response = await fetch(`/api/admin/forum/${threadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal memperbarui thread");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["forum"] });
      queryClient.invalidateQueries({
        queryKey: ["forum", variables.threadId],
      });
    },
  });
};

// Delete thread
export const useDeleteThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (threadId: number) => {
      const response = await fetch(`/api/admin/forum/${threadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal menghapus thread");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum"] });
    },
  });
};

// Create komentar
export const useCreateKomentar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      threadId,
      data,
    }: {
      threadId: number;
      data: CreateKomentarData;
    }) => {
      const response = await fetch(`/api/admin/forum/${threadId}/komentar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal menambahkan komentar");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["forum", variables.threadId],
      });
      queryClient.invalidateQueries({ queryKey: ["forum"] });
    },
  });
};
