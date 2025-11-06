// components/MainSection.tsx
"use client";

import { useState } from "react";
import KelasCard from "./KelasCard";
import { useKelas } from "../hooks/useKelas";

const MainSection = () => {
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  const {
    data: kelasList,
    isLoading,
    error,
  } = useKelas({
    kategori: selectedKategori || undefined,
    level: selectedLevel || undefined,
  });

  const categories = [
    "Semua",
    "Bisnis",
    "Teknologi",
    "Kewirausahaan",
    "Marketing",
    "Keuangan",
  ];

  const levels = [
    { value: "", label: "Semua Level" },
    { value: "beginner", label: "Pemula" },
    { value: "intermediate", label: "Menengah" },
    { value: "advanced", label: "Lanjutan" },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <section className="mycontainer flex gap-10 text-light py-20 w-full">
        {/* Sidebar Filter */}
        <div className="w-2/12">
          <div className="sticky top-24">
            {/* Filter Kategori */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Kategori</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setSelectedKategori(cat === "Semua" ? "" : cat)
                    }
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      (cat === "Semua" && !selectedKategori) ||
                      selectedKategori === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Level */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Level</h3>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 focus:border-blue-600 focus:outline-none"
              >
                {levels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filter */}
            {(selectedKategori || selectedLevel) && (
              <button
                onClick={() => {
                  setSelectedKategori("");
                  setSelectedLevel("");
                }}
                className="w-full mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-10/12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Katalog Kelas</h1>
            <p className="text-gray-400">
              Temukan kelas yang sesuai dengan minat dan kebutuhan Anda
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-700"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 text-center">
              <svg
                className="w-12 h-12 text-red-600 mx-auto mb-4"
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
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                Terjadi Kesalahan
              </h3>
              <p className="text-gray-400">
                Gagal memuat data kelas. Silakan coba lagi.
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && kelasList?.length === 0 && (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-600 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Tidak Ada Kelas
              </h3>
              <p className="text-gray-500">
                Tidak ada kelas yang sesuai dengan filter yang dipilih.
              </p>
            </div>
          )}

          {/* Kelas Grid */}
          {!isLoading && !error && kelasList && kelasList.length > 0 && (
            <div className="grid grid-cols-2 gap-6">
              {kelasList.map((kelas) => (
                <KelasCard
                  key={kelas.id}
                  id={kelas.id}
                  judul={kelas.judul}
                  deskripsi={kelas.deskripsi}
                  kategori={kelas.kategori}
                  thumbnail={kelas.thumbnail}
                  durasi={kelas.durasi}
                  level={kelas.level}
                  instruktur={kelas.instruktur}
                  jumlahPeserta={kelas.jumlahPeserta}
                  jumlahMateri={kelas.jumlahMateri}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MainSection;
