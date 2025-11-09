// /app/api/profil/model/profile.ts
import { Prisma } from "@prisma/client";
import {
  ProfileFormData,
  ProfileFormInput,
} from "@/app/api/profil/zod/profile";

// Tipe data dari Prisma - sesuaikan dengan query API Anda
export const profileWithMahasiswaValidator =
  Prisma.validator<Prisma.PenggunaDefaultArgs>()({
    include: {
      mahasiswa: {
        include: {
          _count: {
            select: {
              threads: true,
              komentar: true,
              proyekBisnis: true,
              enrollments: true,
            },
          },
          threads: {
            select: {
              thread_id: true,
              judul: true,
              isi: true,
              jumlah_views: true,
              jumlah_komentar: true,
              _count: {
                select: { komentar: true },
              },
            },
          },
          komentar: {
            select: {
              komentar_id: true,
              isi_komentar: true,
              tanggal_dibuat: true,
              thread: {
                select: {
                  judul: true,
                },
              },
            },
          },
          proyekBisnis: {
            select: {
              proyek_id: true,
              nama_proyek: true,
              deskripsi: true,
              status_proyek: true,
              dokumen: true,
            },
          },
          enrollments: {
            select: {
              enrollment_id: true,
              tanggal_mulai: true,
              tanggal_selesai: true,
              status: true,
              progres_persen: true,
              kursus: {
                select: {
                  kursus_id: true,
                  judul: true,
                  deskripsi: true,
                  kategori: true,
                  level: true,
                },
              },
            },
          },
        },
      },
    },
  });

// Tipe dasar dari Prisma
type ProfileWithMahasiswaBase = Prisma.PenggunaGetPayload<
  typeof profileWithMahasiswaValidator
>;

// Extend dengan statistik yang ditambahkan di API route
export type ProfileWithMahasiswa = ProfileWithMahasiswaBase & {
  statistik?: {
    total_threads: number;
    total_komentar: number;
    total_proyek: number;
    total_courses: number;
  } | null;
};

// Props untuk ProfileSection
export interface ProfileSectionProps {
  profile: ProfileWithMahasiswa | null | undefined;
  isLoading: boolean;
  onEditClick: () => void;
}

// Props untuk ProfileForm
export interface ProfileFormProps {
  profile: ProfileWithMahasiswa | null | undefined;
  onCancel: () => void;
  onSave: (data: ProfileFormData) => void;
  isSaving: boolean;
}

// Ekspor ulang tipe form
export type { ProfileFormData, ProfileFormInput };
