"use client";

import { ErrorPopup } from "@/shared/components/popup/error";
import { RegisterForm } from "../components/Form";
import { useRegister } from "../hooks/useRegister";

export default function RegisterContainer() {
  const {
    formData,
    error,
    isLoading,
    handleChange,
    handleSubmit,
    handleGoogleSignIn,
  } = useRegister();

  return (
    <div className="flex min-h-screen">
      {/* Sisi Kiri - Form */}
      <div className="flex flex-1 flex-col justify-center">
        <div className="">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-light">
              Daftar
            </h2>
            <p className="mt-2 text-sm text-light/70">
              Find your space and innovate with Innoventum
            </p>
          </div>

          <RegisterForm
            formData={formData}
            isLoading={isLoading}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onGoogleSignIn={handleGoogleSignIn}
          />
          <ErrorPopup error={error} duration={3000} />
        </div>
      </div>
    </div>
  );
}
