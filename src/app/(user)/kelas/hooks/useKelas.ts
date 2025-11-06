// hooks/useKelas.ts
import { useQuery } from "@tanstack/react-query";

interface Kursus {
  id: number;
  judul: string;
  deskripsi: string;
  kategori: string;
  thumbnail: string | null;
  durasi: number;
  level: string;
  status: string;
  instruktur: string;
  jumlahPeserta: number;
  jumlahMateri: number;
}

interface UseKelasParams {
  kategori?: string;
  level?: string;
  status?: string;
}

const fetchKelas = async (params: UseKelasParams = {}): Promise<Kursus[]> => {
  const queryParams = new URLSearchParams();

  if (params.kategori) queryParams.append("kategori", params.kategori);
  if (params.level) queryParams.append("level", params.level);
  if (params.status) queryParams.append("status", params.status);

  const res = await fetch(`/api/kelas?${queryParams.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch kelas");
  }

  const data = await res.json();
  return data.data;
};

export const useKelas = (params: UseKelasParams = {}) => {
  return useQuery({
    queryKey: ["kelas", params],
    queryFn: () => fetchKelas(params),
    staleTime: 5 * 60 * 1000, // 5 menit
    gcTime: 10 * 60 * 1000, // 10 menit (sebelumnya cacheTime)
  });
};

// Hook untuk single kelas
const fetchKelasById = async (id: number): Promise<Kursus> => {
  const res = await fetch(`/api/kelas/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch kelas detail");
  }

  const data = await res.json();
  return data.data;
};

export const useKelasById = (id: number) => {
  return useQuery({
    queryKey: ["kelas", id],
    queryFn: () => fetchKelasById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
