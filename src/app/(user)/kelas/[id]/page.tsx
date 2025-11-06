"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import KelasMateriSection from "./components/KelasMateriSection";
import { Materi, useEnrollKelas, useKelasDetail } from "./hooks/useKelasDetail";
import KelasOverview from "./components/kelasOverview";

export default function KelasDetailPage() {
  const params = useParams();
  const kelasId = params?.id as string;

  const [selectedMateri, setSelectedMateri] = useState<Materi | null>(null);

  const [completedMateriIds, setCompletedMateriIds] = useState<number[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    if (kelasId) {
      const saved = localStorage.getItem(`completed_materi_${kelasId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(
            "Failed to parse completed materi from localStorage",
            e
          );
          return [];
        }
      }
    }
    return [];
  });

  const { data: kelas, isLoading, error } = useKelasDetail(kelasId);
  const { mutate: enroll, isPending: isEnrolling } = useEnrollKelas();

  useEffect(() => {
    if (kelasId) {
      localStorage.setItem(
        `completed_materi_${kelasId}`,
        JSON.stringify(completedMateriIds)
      );
    }
  }, [completedMateriIds, kelasId]);

  const handleEnroll = () => {
    enroll(kelasId, {
      onSuccess: () => {
        if (kelas?.materi && kelas.materi.length > 0) {
          setSelectedMateri(kelas.materi[0]);
        }
      },
      onError: (error: Error) => {},
    });
  };

  const handleSelectMateri = (materi: Materi) => {
    setSelectedMateri(materi);
  };

  const handleMarkComplete = () => {
    if (!selectedMateri) return;

    const newCompleted = [...completedMateriIds];
    const index = newCompleted.indexOf(selectedMateri.id);

    if (index === -1) {
      newCompleted.push(selectedMateri.id);
    } else {
      newCompleted.splice(index, 1);
    }

    setCompletedMateriIds(newCompleted);
    handleNext();
  };

  const materiArray = kelas?.materi || [];

  const handlePrevious = () => {
    if (materiArray.length === 0 || !selectedMateri) return;

    const currentIndex = materiArray.findIndex(
      (m: Materi) => m.id === selectedMateri.id
    );

    if (currentIndex > 0) {
      setSelectedMateri(materiArray[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (materiArray.length === 0 || !selectedMateri) return;

    const currentIndex = materiArray.findIndex(
      (m: Materi) => m.id === selectedMateri.id
    );

    if (currentIndex < materiArray.length - 1) {
      setSelectedMateri(materiArray[currentIndex + 1]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error.message}</div>
      </div>
    );
  }

  if (!kelas) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-white text-xl">Kelas tidak ditemukan</div>
      </div>
    );
  }

  const currentIndex = selectedMateri
    ? materiArray.findIndex((m: Materi) => m.id === selectedMateri.id)
    : -1;

  return (
    <div className="min-h-screen bg-dark text-light py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{kelas.judul}</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          <div className="space-y-4">
            <img
              className="rounded-lg bg-gray-700 h-64 w-full object-cover"
              alt={kelas.judul}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/placeholder-course.jpg";
              }}
            />

            <div className="flex gap-2 flex-wrap">
              {kelas.kategori && (
                <span className="px-4 py-2 bg-blue-500 rounded-full text-sm">
                  {kelas.kategori}
                </span>
              )}

              <span
                className={`px-4 py-2 rounded-full text-sm ${
                  kelas.level === "beginner"
                    ? "bg-green-500"
                    : kelas.level === "intermediate"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {kelas.level}
              </span>

              <span className="px-4 py-2 bg-purple-500 rounded-full text-sm">
                {kelas.durasi} menit
              </span>
            </div>
          </div>

          <KelasOverview
            kelas={kelas}
            isEnrolling={isEnrolling}
            onEnroll={handleEnroll}
          />
        </div>

        <KelasMateriSection
          materiArray={materiArray}
          selectedMateri={selectedMateri}
          completedMateriIds={completedMateriIds}
          onSelectMateri={handleSelectMateri}
          onPrevious={currentIndex > 0 ? handlePrevious : undefined}
          onNext={
            currentIndex < materiArray.length - 1 ? handleNext : undefined
          }
          onMarkComplete={handleMarkComplete}
        />
      </div>
    </div>
  );
}
