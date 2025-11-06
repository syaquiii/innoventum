// hooks/useKelasDetail.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Instruktur {
  nama: string;
  email: string;
  jabatan: string;
}

interface Statistik {
  jumlahPeserta: number;
  jumlahMateri: number;
  jumlahVideo: number;
  jumlahDokumen: number;
  jumlahLatihan: number;
}

export interface Materi {
  id: number;
  judul: string;
  urutan: number;
  tipe: string;
  url: string;
  durasi?: number;
}

interface MateriByTipe {
  video: Array<{
    id: number;
    judul: string;
    urutan: number;
    durasi?: number;
  }>;
  dokumen: Array<{
    id: number;
    judul: string;
    urutan: number;
  }>;
  latihan: Array<{
    id: number;
    judul: string;
    urutan: number;
  }>;
}

interface Peserta {
  id: number;
  nama: string;
  foto: string | null;
  tanggalBergabung: string;
  status: string;
}

interface Enrollment {
  id: number;
  tanggalMulai: string;
  tanggalSelesai: string | null;
  progres: number;
  status: string;
}

export interface KelasDetail {
  id: number;
  judul: string;
  deskripsi: string;
  kategori: string;
  thumbnail: string | null;
  durasi: number;
  totalDurasiMateri: number;
  level: string;
  status: string;
  instruktur: Instruktur;
  statistik: Statistik;
  materi: Materi[];
  materiByTipe: MateriByTipe;
  pesertaTerbaru: Peserta[];
  enrollment: Enrollment | null;
  isEnrolled: boolean;
}

const fetchKelasDetail = async (id: string): Promise<KelasDetail> => {
  const res = await fetch(`/api/kelas/${id}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch kelas detail");
  }

  const data = await res.json();
  return data.data;
};

export const useKelasDetail = (id: string) => {
  return useQuery({
    queryKey: ["kelas", id],
    queryFn: () => fetchKelasDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook untuk enroll kelas
const enrollKelas = async (id: string) => {
  const res = await fetch(`/api/kelas/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to enroll");
  }

  const data = await res.json();
  return data;
};

export const useEnrollKelas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollKelas,
    onSuccess: (data, kelasId) => {
      // Invalidate queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ["kelas", kelasId] });
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
    },
  });
};
