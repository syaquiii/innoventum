"use client";

import { ErrorPopup } from "@/shared/components/popup/error";
import { LoginForm } from "../components/Form";
import { useLogin } from "../hooks/useLogin";

export default function LoginContainer() {
  const {
    email,
    password,
    error,
    isLoading,
    setEmail,
    setPassword,
    fieldErrors,
    handleSubmit,
    handleGoogleSignIn,
  } = useLogin();

  return (
    <div>
      <div className="space-y-3">
        <h1 className="text-light text-3xl font-semibold">Masuk</h1>
        <span className="text-light">
          Find your space and innovate with Innoventum!
        </span>
      </div>
      <LoginForm
        email={email}
        password={password}
        isLoading={isLoading}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        fieldErrors={fieldErrors}
        onGoogleSignIn={handleGoogleSignIn}
      />

      <ErrorPopup error={error} />
    </div>
  );
}
