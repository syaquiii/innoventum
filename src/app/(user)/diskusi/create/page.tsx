// app/(dashboard)/forum/create/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CreateThreadForm from "../components/CreateThreadForm";

export default function CreateThreadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/forum/create");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <section className="bg-dark">
      <div className="mycontainer py-40 ">
        {/* Back Button */}
        <Link
          href="/diskusi"
          className="inline-flex items-center gap-2 text-light mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Forum
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light">Buat Thread Baru</h1>
          <p className="text-light mt-2">Mulai diskusi baru dengan komunitas</p>
        </div>

        {/* Form */}
        <div className="rounded-lg border overflow-hidden border-gray-200">
          <CreateThreadForm />
        </div>
      </div>
    </section>
  );
}
