"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession, SessionContextValue } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Role, Pengguna, Mahasiswa, Administrator } from "@prisma/client";

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

  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery<FullProfile, Error>({
    queryKey: ["profil"],
    queryFn: fetchProfil,
    enabled: status === "authenticated",
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const value: AuthContextType = {
    session,
    status,
    profile,
    isLoadingProfile,
    profileError,
    refetchProfile: () => refetchProfile(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
