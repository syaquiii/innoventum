// app/(mahasiswa)/mentor/[id]/components/MentorDetailContainer.tsx
"use client";

import { useRouter } from "next/navigation";
import { useMentor } from "../../hooks/useMentor";
import { MentorDetailView } from "../components/MentorDetailView";
import { Popup } from "@/shared/components/popup/NotificationPopup";
import { useState } from "react";
import { MentorDetailLanding } from "../components/MentorDetailLanding";

interface MentorDetailContainerProps {
  mentorId: number;
}

export function MentorDetailContainer({
  mentorId,
}: MentorDetailContainerProps) {
  const [popup, setPopup] = useState<{
    message: string;
    variant: "success" | "error" | "info";
  } | null>(null);
  const router = useRouter();
  const { data: mentor, isLoading, error } = useMentor(mentorId);
  const handleBack = () => {
    router.push("/mentor");
  };

  const handleContactMentor = () => {
    if (!mentor?.email_kontak) {
      setPopup({
        message: "Alamat email mentor tidak tersedia.",
        variant: "error",
      });
      return;
    }

    navigator.clipboard
      .writeText(mentor.email_kontak)
      .then(() => {
        setPopup({
          message: `Email mentor berhasil disalin: ${mentor.email_kontak}`,
          variant: "success", // <- 'success' lebih pas di sini
        });
      })
      .catch((err) => {
        console.error("Gagal menyalin email: ", err);
        setPopup({
          message: "Gagal menyalin email. Silakan salin manual.",
          variant: "error",
        });
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat detail mentor...</p>
        </div>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-light mb-2">
            Mentor Tidak Ditemukan
          </h2>
          <p className="text-gray-400 mb-6">
            Mentor yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Kembali ke Daftar Mentor
          </button>
        </div>
      </div>
    );
  }

  return (
    <main>
      <MentorDetailLanding 
      mentor={mentor}
      />
      <>
        <Popup
          message={popup?.message}
          variant={popup?.variant}
          onClose={() => setPopup(null)}
        />
        <MentorDetailView
          mentor={mentor}
          onBack={handleBack}
          onContact={handleContactMentor}
        />
      </>
    </main>
  );
}
