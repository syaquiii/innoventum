import { Prisma } from "@prisma/client";
import {
  ProfileFormData,
  ProfileFormInput,
} from "@/app/api/profil/zod/profile";

// Tipe data dari Prisma (sudah benar dari Anda)
export const profileWithMahasiswa =
  Prisma.validator<Prisma.PenggunaDefaultArgs>()({
    include: {
      mahasiswa: {
        include: {
          _count: {
            select: { enrollments: true, threads: true },
          },
        },
      },
    },
  });

export type ProfileWithMahasiswa = Prisma.PenggunaGetPayload<
  typeof profileWithMahasiswa
>;

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
  // onSave menerima tipe OUTPUT (Date)
  onSave: (data: ProfileFormData) => void;
  isSaving: boolean;
}

// Ekspor ulang tipe form agar komponen lain bisa impor dari satu tempat
export type { ProfileFormData, ProfileFormInput };
