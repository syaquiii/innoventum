import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

export type RegisterFormData = {
  email: string;
  password: string;
  nama_lengkap: string;
  tanggal_lahir: string;
  nomor_telepon: string;
  nim: string;
  institusi: string;
  program_studi: string;
};

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
    throw new Error(errorData.error || "Gagal mendaftar");
  }

  return response.json();
};

export function useRegister() {
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

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      router.push("/login?status=registrasi-berhasil");
    },
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/home" });
  };

  return {
    formData,
    error: mutation.isError ? mutation.error.message : undefined,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    handleChange,
    handleSubmit,
    handleGoogleSignIn,
  };
}
