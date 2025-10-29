import AuthImage from "@/shared/components/image/AuthImage";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col lg:grid lg:grid-cols-2 font-poppins h-screen w-full">
      <section className="w-full lg:w-full bg-dark flex items-center justify-center px-6 py-8 lg:px-12">
        <div className="w-full max-w-md">{children}</div>
      </section>
      <section className="hidden lg:flex flex-col space-y-10 px-20 items-center justify-center bg-light">
        <div className="w-full flex justify-center">
          <AuthImage className="w-[480px] max-w-full h-auto" />
        </div>
        <p className=" text-dark text-lg  tracking-tight leading-snug">
          Innoventum – Tempat di mana belajar jadi lebih fleksibel, berkembang
          jadi lebih mudah, dan kesempatan baru selalu menanti! 🚀✨
        </p>
      </section>
    </main>
  );
}
