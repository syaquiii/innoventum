"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useSession, SessionContextValue } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Role, Pengguna, Mahasiswa, Administrator } from "@prisma/client";
// --- HAPUS: Hooks untuk redirection tidak lagi diperlukan ---
// import { useRouter, usePathname } from "next/navigation";
import { Popup } from "../components/popup/NotificationPopup"; // Pastikan path ini benar

// ... (Tipe data Anda tetap sama)
type ProfileEnrollmentCount = {
  enrollments: number;
  threads: number;
};

type ProfileMahasiswa = Mahasiswa & {
  _count: ProfileEnrollmentCount;
};

export type FullProfile = Pengguna & {
  mahasiswa: ProfileMahasiswa | null;
  administrator: Administrator | null;
};

export interface AuthContextType {
  session: SessionContextValue["data"];
  status: SessionContextValue["status"];

  profile: FullProfile | undefined;
  isLoadingProfile: boolean;
  profileError: Error | null;
  refetchProfile: () => void;
}

const fetchProfil = async (): Promise<FullProfile> => {
  const res = await fetch("/api/profil");
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Gagal mengambil data profil");
  }
  return res.json();
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const [popup, setPopup] = useState<{
    message: string;
    variant: "success" | "info" | "error"; // Sebaiknya tambahkan 'error' juga
  } | null>(null);

  // --- HAPUS: Hooks untuk redirection ---
  // const router = useRouter();
  // const pathname = usePathname();

  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery<FullProfile, Error>({
    queryKey: ["profil"],
    queryFn: fetchProfil,
    enabled: status === "authenticated",
    staleTime: 1000 * 60 * 5, // 5 menit
    retry: 1,
  });

  // --- MODIFIKASI: useEffect untuk cek kelengkapan profil ---
  useEffect(() => {
    if (isLoadingProfile || status !== "authenticated" || !profile) {
      return;
    }

    const isMahasiswa = profile.role === Role.mahasiswa; // Pastikan 'Role.mahasiswa' sesuai
    const isProfileIncomplete = isMahasiswa && profile.mahasiswa === null;

    // --- MODIFIKASI: Hanya tampilkan popup, tanpa cek pathname ---
    if (isProfileIncomplete) {
      setPopup({
        // --- MODIFIKASI: Pesan diubah, tidak ada info redirect ---
        message:
          "Profil Anda belum lengkap. Silakan lengkapi di halaman profil.",
        variant: "info",
      });

      // --- HAPUS: Logika redirect (setTimeout dan clearTimeout) ---
    }
  }, [profile, isLoadingProfile, status]); // --- HAPUS: dependensi router & pathname
  // --------------------------------------------------------

  const value: AuthContextType = {
    session,
    status,
    profile,
    isLoadingProfile,
    profileError,
    refetchProfile: () => refetchProfile(),
  };

  return (
    <AuthContext.Provider value={value}>
      <Popup
        message={popup?.message}
        variant={popup?.variant}
        onClose={() => setPopup(null)}
        // --- MODIFIKASI: Hapus durasi agar pakai default (5000ms) ---
        // duration={3000}
      />
      {children}
    </AuthContext.Provider>
  );
}
