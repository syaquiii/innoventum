// app/kelas/[id]/components/KelasMateriContent.tsx

import { Button } from "@/components/ui/button";

interface Materi {
  id: number;
  judul: string;
  urutan: number;
  tipe: string;
  url: string;
  durasi?: number;
}

interface KelasMateriContentProps {
  selectedMateri: Materi | null;
  onPrevious?: () => void;
  onNext?: () => void;
  onMarkComplete: () => void;
}

/**
 * Helper untuk mengubah URL YouTube "watch" menjadi URL "embed".
 * @param url URL YouTube (cth: https://www.youtube.com/watch?v=MfNmhTDEvfU)
 * @returns URL embed (cth: https://www.youtube.com/embed/MfNmhTDEvfU)
 */
const getYouTubeEmbedUrl = (url: string) => {
  try {
    const videoUrl = new URL(url);
    // Cari parameter 'v' untuk video (cth: ...?v=VIDEO_ID)
    const videoId = videoUrl.searchParams.get("v");

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Fallback jika URL-nya sudah/embed atau format lain (cth: youtu.be/...)
    // Ini regex sederhana untuk mengambil ID dari format youtu.be/ID
    if (videoUrl.hostname === "youtu.be") {
      const pathId = videoUrl.pathname.split("/")[1];
      if (pathId) {
        return `https://www.youtube.com/embed/${pathId}`;
      }
    }
  } catch (error) {
    console.error("URL video tidak valid:", url, error);
    // Biarkan URL apa adanya jika gagal di-parse
  }

  // Kembalikan URL asli jika tidak bisa di-parse
  // (meskipun kemungkinan besar akan gagal di-load di iframe)
  return url;
};

const KelasMateriContent = ({
  selectedMateri,
  onPrevious,
  onNext,
  onMarkComplete,
}: KelasMateriContentProps) => {
  // Jika belum ada materi yang dipilih
  if (!selectedMateri) {
    return (
      <div className="bg-[#16213e]/50 rounded-lg p-12 text-center min-h-[520px] flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Pilih Materi untuk Mulai Belajar
          </h3>
          <p className="text-gray-400">
            Klik salah satu materi di sebelah kiri untuk mulai mempelajari
            konten
          </p>
        </div>
      </div>
    );
  }

  // --- PERUBAHAN DI SINI ---
  // Siapkan URL embed jika tipenya video
  let embedUrl = "";
  if (selectedMateri.tipe === "video") {
    embedUrl = getYouTubeEmbedUrl(selectedMateri.url);
  }
  // --- BATAS PERUBAHAN ---

  // Render konten materi
  return (
    <div className="bg-light rounded-2xl p-8 min-h-[520px] flex flex-col">
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
      <div className="mb-8 flex-1">
        {/* --- PERUBAHAN DI SINI: Menggunakan <iframe> --- */}
        {selectedMateri.tipe === "video" && (
          <div className="bg-black rounded-lg overflow-hidden aspect-video">
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title={selectedMateri.judul}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {/* --- BATAS PERUBAHAN --- */}

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
              <span className="font-semibold">Download atau Buka Dokumen</span>
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
                Latihan untuk materi: <strong>{selectedMateri.judul}</strong>
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

      {/* Action Buttons (Tidak berubah) */}
      <div className="flex gap-4 pt-6 border-t mx-auto border-purple-200">
        <Button onClick={onPrevious} disabled={!onPrevious}>
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
        </Button>

        <Button onClick={onMarkComplete} variant={"normal"}>
          ✓ Tandai sebagai selesai
        </Button>

        <Button onClick={onNext} disabled={!onNext}>
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
        </Button>
      </div>
    </div>
  );
};

export default KelasMateriContent;
