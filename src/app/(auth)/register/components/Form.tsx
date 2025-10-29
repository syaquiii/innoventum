"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface RegisterFormProps {
  formData: {
    email: string;
    password: string;
    nama_lengkap: string;
    tanggal_lahir: string;
    nomor_telepon: string;
    nim: string;
    institusi: string;
    program_studi: string;
  };
  fieldErrors?: {
    email?: string;
    password?: string;
    nama_lengkap?: string;
    tanggal_lahir?: string;
    nomor_telepon?: string;
    nim?: string;
    institusi?: string;
    program_studi?: string;
  };
  error?: string;
  isLoading?: boolean;
  onChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
}

export function RegisterForm({
  formData,
  fieldErrors,
  error,
  isLoading = false,
  onChange,
  onSubmit,
  onGoogleSignIn,
}: RegisterFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <form className="text-light space-y-4 mt-3" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="font-semibold" htmlFor="nama_lengkap">
          Nama Lengkap
        </label>
        <Input
          rules={[
            {
              rule: (val) => !!val,
              message: "Nama lengkap wajib diisi",
            },
          ]}
          id="nama_lengkap"
          name="nama_lengkap"
          type="text"
          value={formData.nama_lengkap}
          onChange={handleChange}
          required
          disabled={isLoading}
          className={fieldErrors?.nama_lengkap ? "border-destructive" : ""}
        />
        {fieldErrors?.nama_lengkap && (
          <p className="text-destructive text-sm mt-1">
            {fieldErrors.nama_lengkap}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-semibold" htmlFor="email">
            Email
          </label>
          <Input
            rules={[
              {
                rule: (val) => !!val,
                message: "Email wajib diisi",
              },
            ]}
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={fieldErrors?.email ? "border-destructive" : ""}
          />
          {fieldErrors?.email && (
            <p className="text-destructive text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="font-semibold" htmlFor="password">
            Kata Sandi
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            rules={[
              { rule: (val) => !!val, message: "Kata sandi wajib diisi" },
              {
                rule: (val) => val.length >= 8,
                message: "Kata sandi minimal 8 karakter",
              },
            ]}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={fieldErrors?.password ? "border-destructive" : ""}
          />
          {fieldErrors?.password && (
            <p className="text-destructive text-sm mt-1">
              {fieldErrors.password}
            </p>
          )}
        </div>
      </div>

      {/* Bento Box Grid - NIM & Institusi (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-semibold" htmlFor="nim">
            NIM
          </label>
          <Input
            rules={[
              {
                rule: (val) => !!val,
                message: "NIM wajib diisi",
              },
            ]}
            id="nim"
            name="nim"
            type="text"
            value={formData.nim}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={fieldErrors?.nim ? "border-destructive" : ""}
          />
          {fieldErrors?.nim && (
            <p className="text-destructive text-sm mt-1">{fieldErrors.nim}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="font-semibold" htmlFor="institusi">
            Institusi
          </label>
          <Input
            rules={[
              {
                rule: (val) => !!val,
                message: "Institusi wajib diisi",
              },
            ]}
            id="institusi"
            name="institusi"
            type="text"
            value={formData.institusi}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={fieldErrors?.institusi ? "border-destructive" : ""}
          />
          {fieldErrors?.institusi && (
            <p className="text-destructive text-sm mt-1">
              {fieldErrors.institusi}
            </p>
          )}
        </div>
      </div>

      {/* Bento Box Grid - Program Studi (Full Width) */}
      <div className="space-y-2">
        <label className="font-semibold" htmlFor="program_studi">
          Program Studi
        </label>
        <Input
          rules={[
            {
              rule: (val) => !!val,
              message: "Program studi wajib diisi",
            },
          ]}
          id="program_studi"
          name="program_studi"
          type="text"
          value={formData.program_studi}
          onChange={handleChange}
          required
          disabled={isLoading}
          className={fieldErrors?.program_studi ? "border-destructive" : ""}
        />
        {fieldErrors?.program_studi && (
          <p className="text-destructive text-sm mt-1">
            {fieldErrors.program_studi}
          </p>
        )}
      </div>

      {/* Bento Box Grid - Tanggal Lahir & Nomor Telepon (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-semibold" htmlFor="tanggal_lahir">
            Tanggal Lahir
          </label>
          <Input
            rules={[
              {
                rule: (val) => !!val,
                message: "Tanggal lahir wajib diisi",
              },
            ]}
            id="tanggal_lahir"
            name="tanggal_lahir"
            type="date"
            value={formData.tanggal_lahir}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={fieldErrors?.tanggal_lahir ? "border-destructive" : ""}
          />
          {fieldErrors?.tanggal_lahir && (
            <p className="text-destructive text-sm mt-1">
              {fieldErrors.tanggal_lahir}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="font-semibold" htmlFor="nomor_telepon">
            Nomor Telepon
          </label>
          <Input
            rules={[
              {
                rule: (val) => !!val,
                message: "Nomor telepon wajib diisi",
              },
            ]}
            id="nomor_telepon"
            name="nomor_telepon"
            type="tel"
            value={formData.nomor_telepon}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={fieldErrors?.nomor_telepon ? "border-destructive" : ""}
          />
          {fieldErrors?.nomor_telepon && (
            <p className="text-destructive text-sm mt-1">
              {fieldErrors.nomor_telepon}
            </p>
          )}
        </div>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="space-y-4 mt-8">
        <Button
          variant="light"
          type="submit"
          disabled={isLoading}
          className="w-full font-semibold text-base h-12 shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          {isLoading ? "Mendaftarkan..." : "Daftar"}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t-2 border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-darker px-4 text-light font-medium">
              Atau lanjutkan dengan
            </span>
          </div>
        </div>

        <Button
          onClick={onGoogleSignIn}
          type="button"
          variant="outline"
          disabled={isLoading}
          className="w-full font-semibold text-base h-12 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
          size="lg"
        >
          <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-gray-700">Daftar dengan Google</span>
        </Button>
      </div>

      <div className="text-right text-sm text-light mt-4">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold underline">
          Masuk
        </Link>
      </div>
    </form>
  );
}
