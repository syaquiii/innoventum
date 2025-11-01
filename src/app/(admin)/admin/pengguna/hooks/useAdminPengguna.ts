import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  user_id: number;
  email: string;
  nama_lengkap: string;
  tanggal_lahir: string | null;
  nomor_telepon: string | null;
  role: "mahasiswa" | "admin";
  emailVerified: Date | null;
  image: string | null;
  mahasiswa?: {
    mahasiswa_id: number;
    nim: string;
    institusi: string;
    program_studi: string;
    jumlah_kursus_selesai: number;
    foto_profil: string | null;
  } | null;
  administrator?: {
    admin_id: number;
    nik: string;
    jabatan: string;
    level_akses: string;
  } | null;
}

interface UsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: "mahasiswa" | "admin" | "";
}

interface CreateUserData {
  email: string;
  password?: string;
  nama_lengkap: string;
  tanggal_lahir?: string;
  nomor_telepon?: string;
  role: "mahasiswa" | "admin";
  // Mahasiswa fields
  nim?: string;
  institusi?: string;
  program_studi?: string;
  // Administrator fields
  nik?: string;
  jabatan?: string;
  level_akses?: string;
}

interface UpdateUserData extends Partial<CreateUserData> {
  foto_profil?: string | null;
}

// Fetch all users
export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery<UsersResponse>({
    queryKey: ["admin-users", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.role) params.append("role", filters.role);

      const response = await fetch(`/api/admin/users?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });
}

// Fetch single user
export function useAdminUser(userId: number | null) {
  return useQuery<{ data: User }>({
    queryKey: ["admin-user", userId],
    queryFn: async () => {
      // Pengecekan 'if (!userId)' tidak lagi diperlukan di sini
      // karena 'enabled' sudah menangani kasus null.
      const response = await fetch(`/api/admin/users/${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return response.json();
    },
    // DIPERBAIKI: Gunakan 'userId != null'
    // Ini akan mencegah query berjalan saat userId adalah null atau undefined,
    // tapi TETAP berjalan jika userId adalah 0 (angka valid).
    enabled: userId != null,
  });
}

// Create user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create user");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {},
  });
}

// Update user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: number;
      data: UpdateUserData;
    }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-user", variables.userId],
      });
    },
    onError: (error: Error) => {},
  });
}

// Delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete user");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: Error) => {},
  });
}

// Export types
export type {
  User,
  UsersResponse,
  UserFilters,
  CreateUserData,
  UpdateUserData,
};
