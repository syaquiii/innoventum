import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface MentorFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface MentorData {
  nama: string;
  bio: string;
  keahlian: string;
  foto?: string;
  email_kontak: string;
  linkedin?: string;
  status: "aktif" | "nonaktif";
}

export const useMentors = (filters: MentorFilters = {}) => {
  return useQuery({
    queryKey: ["mentors", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);

      const res = await fetch(`/api/admin/mentor?${params}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal memuat data");
      }
      return res.json();
    },
  });
};

export const useCreateMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MentorData) => {
      const res = await fetch("/api/admin/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal membuat mentor");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
};

export const useUpdateMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<MentorData>;
    }) => {
      const res = await fetch(`/api/admin/mentor/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal memperbarui mentor");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
};

export const useDeleteMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/mentor/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal menghapus mentor");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
};
