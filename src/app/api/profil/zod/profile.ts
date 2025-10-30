import { z } from "zod";

export const profileSchema = z.object({
  nama_lengkap: z
    .string()
    .min(3, { message: "Nama lengkap minimal 3 karakter" }),

  // --- INI PERBAIKANNYA ---
  // Kita hapus objek kustomisasi error-nya.
  // Zod akan otomatis validasi ini sebagai tanggal.
  // Jika gagal (misal inputnya "abc"), Zod akan pakai error default ("Invalid date").
  tanggal_lahir: z.coerce.date(),

  nomor_telepon: z
    .string()
    .min(10, { message: "Nomor telepon minimal 10 digit" }),

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
export type ProfileFormData = z.infer<typeof profileSchema>;

// Tipe INPUT (Sebelum validasi/koersi)
export type ProfileFormInput = z.input<typeof profileSchema>;
