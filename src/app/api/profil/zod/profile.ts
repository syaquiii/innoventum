// /api/profil/zod/profile.ts
import { z } from "zod";

export const profileSchema = z.object({
  nama_lengkap: z
    .string()
    .min(3, { message: "Nama lengkap minimal 3 karakter" }),

  // Coerce string to Date dengan validasi umur
  tanggal_lahir: z.coerce
    .date()
    .refine(
      (date) => {
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 17; // Minimal 17 tahun
      },
      { message: "Umur minimal 17 tahun" }
    )
    .refine(
      (date) => {
        const age = new Date().getFullYear() - date.getFullYear();
        return age <= 100; // Maksimal 100 tahun
      },
      { message: "Umur maksimal 100 tahun" }
    ),

  nomor_telepon: z
    .string()
    .min(10, { message: "Nomor telepon minimal 10 digit" })
    .regex(/^[0-9+\-\s()]+$/, {
      message:
        "Nomor telepon hanya boleh berisi angka dan simbol +, -, (, ), spasi",
    }),

  mahasiswa: z.object({
    nim: z.string().min(5, { message: "NIM minimal 5 karakter" }),
    institusi: z
      .string()
      .min(3, { message: "Nama institusi minimal 3 karakter" }),
    program_studi: z
      .string()
      .min(3, { message: "Nama program studi minimal 3 karakter" }),
  }),
});

// Tipe OUTPUT (Setelah validasi/koersi)
// tanggal_lahir akan menjadi Date object
export type ProfileFormData = z.infer<typeof profileSchema>;

// Tipe INPUT (Sebelum validasi/koersi)
// tanggal_lahir masih string (misalnya dari form input)
export type ProfileFormInput = z.input<typeof profileSchema>;
