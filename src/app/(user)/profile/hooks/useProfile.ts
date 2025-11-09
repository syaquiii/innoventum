// hooks/useProfile.ts
"use client";

import {
  ProfileFormData,
  ProfileWithMahasiswa,
} from "@/app/api/profil/model/profile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fungsi helper untuk fetcher
async function fetchProfile(): Promise<ProfileWithMahasiswa> {
  const res = await fetch("/api/profil");
  if (!res.ok) {
    throw new Error("Gagal mengambil data profil");
  }
  return res.json();
}

// Fungsi helper untuk updater
async function patchProfile(data: ProfileFormData) {
  const res = await fetch("/api/profil", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    if (res.status === 409) throw new Error(errorData.error);
    throw new Error(errorData.error?.message || "Gagal memperbarui profil");
  }
  return res.json();
}

// Custom Hook
export function useProfile() {
  const queryClient = useQueryClient();

  // 1. Query untuk mengambil data profil
  const { data: profile, isLoading } = useQuery<ProfileWithMahasiswa>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  // 2. Mutasi untuk memperbarui profil
  const { mutate: updateProfile, isPending: isSaving } = useMutation({
    mutationFn: patchProfile,
    onSuccess: () => {
      // Jika sukses, invalidasi query "profile" agar data baru di-fetch
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      // Biarkan komponen yang menangani (atau tambahkan toast di sini)
      console.error("Gagal update profil:", error);
    },
  });

  // 3. Kembalikan semua state dan fungsi yang dibutuhkan oleh UI
  return {
    profile,
    isLoading,
    updateProfile,
    isSaving,
  };
}
