// app/(mahasiswa)/mentor/hooks/useMentor.ts
import { useQuery } from "@tanstack/react-query";

export interface Mentor {
  mentor_id: number;
  nama: string;
  bio: string;
  keahlian: string;
  foto: string | null;
  email_kontak: string;
  linkedin: string | null;
  status: "aktif" | "nonaktif";
  administrator?: {
    admin_id: number;
    pengguna: {
      nama_lengkap: string;
    };
  };
}

export const useMentors = () => {
  return useQuery({
    queryKey: ["mentors"],
    queryFn: async () => {
      const response = await fetch("/api/mentor");
      if (!response.ok) throw new Error("Failed to fetch mentors");
      const result = await response.json();
      return result.data as Mentor[];
    },
  });
};

export const useMentor = (id: number) => {
  return useQuery({
    queryKey: ["mentor", id],
    queryFn: async () => {
      const response = await fetch(`/api/mentor/${id}`);
      if (!response.ok) throw new Error("Failed to fetch mentor");
      const result = await response.json();
      return result.data as Mentor;
    },
    enabled: !!id,
  });
};
