"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react"; // 1. Impor 'signIn'

// Tipe data untuk form
type RegisterFormData = {
  email: string;
  password: string;
  nama_lengkap: string;
  tanggal_lahir: string;
  nomor_telepon: string;
  nim: string;
  institusi: string;
  program_studi: string;
};

// Fungsi yang akan dijalankan oleh useMutation (untuk form manual)
const registerUser = async (formData: RegisterFormData) => {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Lempar error agar ditangkap oleh 'isError' dan 'error'
    throw new Error(errorData.error || "Gagal mendaftar");
  }

  return response.json();
};

/**
 * Halaman Registrasi (UI-002)
 * Menggunakan TanStack Mutation untuk menangani state form.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    nama_lengkap: "",
    tanggal_lahir: "",
    nomor_telepon: "",
    nim: "",
    institusi: "",
    program_studi: "",
  });

  // Setup TanStack Mutation untuk registrasi manual
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // Jika sukses, arahkan ke halaman login
      router.push("/login?status=registrasi-berhasil");
    },
    // onError sudah ditangani oleh state 'error' dari mutation
  });

  // 2. Handler untuk Google Sign-In (akan mendaftar otomatis)
  const handleGoogleSignIn = () => {
    // Panggil 'signIn' dari Google.
    // Ini akan otomatis mendaftarkan jika pengguna baru.
    // Arahkan ke /dasbor (atau /lengkapi-profil jika Anda membuatnya)
    signIn("google", { callbackUrl: "/dasbor" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler untuk form manual
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Panggil API menggunakan mutation
    mutation.mutate(formData);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sisi Kiri - Form (dibuat mirip UI-002) */}
      <div className="flex flex-1 flex-col justify-center bg-gray-900 px-4 py-12 text-white sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Daftar</h2>
            <p className="mt-2 text-sm text-gray-400">
              Find your space and innovate with Innoventum
            </p>
          </div>

          <div className="mt-8">
            {/* Form Registrasi Manual */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ... (Error dan Success messages) ... */}
              {mutation.isError && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">
                    {mutation.error.message}
                  </p>
                </div>
              )}
              {mutation.isSuccess && (
                <div className="rounded-md bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">
                    Registrasi berhasil! Anda akan diarahkan...
                  </p>
                </div>
              )}

              {/* ... (Semua input fields: nama_lengkap, email, password, nim, dll.) ... */}
              {/* Input Fields */}
              <div>
                <label
                  htmlFor="nama_lengkap"
                  className="block text-sm font-medium leading-6"
                >
                  Nama Lengkap
                </label>
                <input
                  id="nama_lengkap"
                  name="nama_lengkap"
                  type="text"
                  required
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6"
                >
                  Kata Sandi
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>

              {/* Data Mahasiswa */}
              <div>
                <label
                  htmlFor="nim"
                  className="block text-sm font-medium leading-6"
                >
                  NIM
                </label>
                <input
                  id="nim"
                  name="nim"
                  type="text"
                  required
                  value={formData.nim}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label
                  htmlFor="institusi"
                  className="block text-sm font-medium leading-6"
                >
                  Institusi
                </label>
                <input
                  id="institusi"
                  name="institusi"
                  type="text"
                  required
                  value={formData.institusi}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label
                  htmlFor="program_studi"
                  className="block text-sm font-medium leading-6"
                >
                  Program Studi
                </label>
                <input
                  id="program_studi"
                  name="program_studi"
                  type="text"
                  required
                  value={formData.program_studi}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label
                  htmlFor="tanggal_lahir"
                  className="block text-sm font-medium leading-6"
                >
                  Tanggal Lahir
                </label>
                <input
                  id="tanggal_lahir"
                  name="tanggal_lahir"
                  type="date"
                  required
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label
                  htmlFor="nomor_telepon"
                  className="block text-sm font-medium leading-6"
                >
                  Nomor Telepon
                </label>
                <input
                  id="nomor_telepon"
                  name="nomor_telepon"
                  type="tel"
                  required
                  value={formData.nomor_telepon}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={mutation.isPending} // Tombol dinonaktifkan saat loading
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                >
                  {mutation.isPending ? "Mendaftarkan..." : "Daftar"}
                </button>
              </div>
            </form>

            {/* --- 3. BAGIAN TAMBAHAN UNTUK GOOGLE --- */}
            <div className="relative mt-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-gray-900 px-6 text-gray-400">Atau</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
              >
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9503 1.19 15.2303 0 12.0003 0C7.31028 0 3.19028 2.73 1.24028 6.6L4.87028 9.7C5.78028 6.95 8.61028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M12 24C15.24 24 17.97 22.81 20.04 20.92L16.61 17.5C15.36 18.68 13.8 19.25 12 19.25C8.59 19.25 5.76 17.05 4.85 14.3L1.22 17.4C3.17 21.28 7.3 24 12 24Z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.85001 14.3C4.63001 13.63 4.50001 12.92 4.50001 12C4.50001 11.08 4.63001 10.37 4.85001 9.7L1.22001 6.6C0.430011 8.24 0.0000114999 10.06 0.0000114999 12C0.0000114999 13.94 0.430011 15.76 1.22001 17.4L4.85001 14.3Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0003 9.25C13.0903 9.25 14.0703 9.63 14.8403 10.37L17.2703 7.94C15.9103 6.7 14.1503 6 12.0003 6C8.61028 6 5.78028 8.2 4.87028 10.9L8.50028 14C9.41028 11.25 12.8203 9.25 12.0003 9.25Z"
                    fill="#4285F4"
                  />
                </svg>
                Daftar dengan Google
              </button>
            </div>
            {/* --- AKHIR BAGIAN TAMBAHAN --- */}

            <p className="mt-8 text-center text-sm text-gray-400">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="font-semibold leading-6 text-blue-400 hover:text-blue-300"
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Sisi Kanan - Gambar (dibuat mirip UI-002) */}
      <div className="relative hidden w-0 flex-1 items-center justify-center bg-gray-50 lg:flex">
        <div className="max-w-md text-center">
          {/* Placeholder untuk gambar */}
          <div className="text-6xl">🎈</div>
          <p className="mt-4 text-lg text-gray-600">
            Innoventum - Tempat di mana belajar jadi lebih fleksibel, berkembang
            jadi lebih mudah, dan kesempatan baru selalu menanti! ✨
          </p>
        </div>
      </div>
    </div>
  );
}
