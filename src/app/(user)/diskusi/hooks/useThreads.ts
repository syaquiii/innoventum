// hooks/useThreads.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Thread {
  thread_id: number;
  mahasiswa_id: number;
  judul: string;
  isi: string;
  jumlah_views: number;
  jumlah_komentar: number;
  mahasiswa: {
    mahasiswa_id: number;
    nim: string;
    foto_profil: string | null;
    pengguna: {
      nama_lengkap: string;
      email: string;
    };
  };
  _count?: {
    komentar: number;
  };
}

interface ThreadsResponse {
  success: boolean;
  data: Thread[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CreateThreadData {
  judul: string;
  isi: string;
}

interface UpdateThreadData {
  judul?: string;
  isi?: string;
}

// GET semua threads
export const useThreads = (page = 1, limit = 10, search = "") => {
  return useQuery<ThreadsResponse>({
    queryKey: ["threads", page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const res = await fetch(`/api/threads?${params}`);
      if (!res.ok) throw new Error("Failed to fetch threads");
      return res.json();
    },
    staleTime: 1000 * 60, // 1 menit
  });
};

// GET detail thread
export const useThread = (threadId: number) => {
  return useQuery({
    queryKey: ["thread", threadId],
    queryFn: async () => {
      const res = await fetch(`/api/threads/${threadId}`);
      if (!res.ok) throw new Error("Failed to fetch thread");
      return res.json();
    },
    enabled: !!threadId,
  });
};

// POST buat thread baru
export const useCreateThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateThreadData) => {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create thread");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
    onError: (error: Error) => {},
  });
};

// PATCH update thread
export const useUpdateThread = (threadId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateThreadData) => {
      const res = await fetch(`/api/threads/${threadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update thread");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thread", threadId] });
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
    onError: (error: Error) => {},
  });
};

// DELETE hapus thread
export const useDeleteThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (threadId: number) => {
      const res = await fetch(`/api/threads/${threadId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete thread");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
    onError: (error: Error) => {},
  });
};
