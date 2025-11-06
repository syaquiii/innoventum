// app/kelas/[id]/components/KelasContent.tsx
import { useState, useMemo } from "react";

interface Materi {
  id: number;
  judul: string;
  urutan: number;
  tipe: string;
  url: string;
  durasi?: number;
}

interface KelasContentProps {
  kelas?: any;
  selectedMateri?: Materi | null;
  showMateriContent?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onMarkComplete?: () => void;
}

const KelasContent = ({
  kelas,
  selectedMateri,
  showMateriContent,
  onPrevious,
  onNext,
  onMarkComplete,
}: KelasContentProps) => {
  // Render Materi Content
  if (showMateriContent && selectedMateri) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-br from-pink-100/90 to-purple-100/90 rounded-2xl p-8">
          {/* Header Materi */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span className="bg-purple-200 px-3 py-1 rounded-full">
                {selectedMateri.tipe === "video" && "📹 Video"}
                {selectedMateri.tipe === "dokumen" && "📄 Dokumen"}
                {selectedMateri.tipe === "latihan" && "✍️ Latihan"}
              </span>
              {selectedMateri.durasi && (
                <span>⏱ {selectedMateri.durasi} menit</span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedMateri.judul}
            </h2>
          </div>

          {/* Content berdasarkan tipe */}
          <div className="mb-8">
            {selectedMateri.tipe === "video" && (
              <div className="bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  controls
                  className="w-full h-full"
                  src={selectedMateri.url}
                >
                  <source src={selectedMateri.url} type="video/mp4" />
                  Browser Anda tidak mendukung video.
                </video>
              </div>
            )}

            {selectedMateri.tipe === "dokumen" && (
              <div className="bg-white rounded-lg p-6 border border-purple-200">
                <a
                  href={selectedMateri.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="font-semibold">
                    Download atau Buka Dokumen
                  </span>
                </a>
                <p className="text-gray-600 text-sm mt-2">
                  Klik link di atas untuk membuka atau mengunduh materi dokumen
                </p>
              </div>
            )}

            {selectedMateri.tipe === "latihan" && (
              <div className="bg-white rounded-lg p-6 border border-purple-200">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 mb-4">
                    Latihan untuk materi:{" "}
                    <strong>{selectedMateri.judul}</strong>
                  </p>
                  <a
                    href={selectedMateri.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-semibold"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Buka Latihan
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-purple-200">
            <button
              onClick={onPrevious}
              disabled={!onPrevious}
              className="flex items-center gap-2 px-6 py-3 bg-white/50 text-gray-700 rounded-lg hover:bg-white transition-colors border border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Sebelumnya
            </button>

            <button
              onClick={onMarkComplete}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-semibold"
            >
              ✓ Tandai sebagai selesai
            </button>

            <button
              onClick={onNext}
              disabled={!onNext}
              className="flex items-center gap-2 px-6 py-3 bg-white/50 text-gray-700 rounded-lg hover:bg-white transition-colors border border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Overview (ketika tidak ada materi yang dipilih)
  return (
    <div className="lg:col-span-2">
      <div className="bg-gradient-to-br from-pink-100/90 to-purple-100/90 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
        <div className="prose prose-lg max-w-none text-gray-800">
          <p className="mb-6 leading-relaxed">{kelas.deskripsi}</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                Materi lengkap dengan {kelas.statistik.jumlahVideo} video,{" "}
                {kelas.statistik.jumlahDokumen} dokumen, dan{" "}
                {kelas.statistik.jumlahLatihan} latihan
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                Sudah diikuti oleh {kelas.statistik.jumlahPeserta} peserta
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Akses selamanya setelah mendaftar</span>
            </div>
          </div>

          <div className="bg-white/50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-gray-700">
              <strong>Instruktur:</strong> {kelas.instruktur.nama} -{" "}
              {kelas.instruktur.jabatan}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {kelas.instruktur.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelasContent;
