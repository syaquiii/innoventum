// components/KelasCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface KelasCardProps {
  id: number;
  judul: string;
  deskripsi: string;
  kategori: string;
  thumbnail: string | null;
  durasi: number;
  level: string;
  instruktur: string;
  jumlahPeserta: number;
  jumlahMateri: number;
}

const KelasCard: React.FC<KelasCardProps> = ({
  id,
  judul,
  deskripsi,
  kategori,
  thumbnail,
  durasi,
  level,
  instruktur,
  jumlahPeserta,
  jumlahMateri,
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-600";
      case "intermediate":
        return "bg-yellow-600";
      case "advanced":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner":
        return "Pemula";
      case "intermediate":
        return "Menengah";
      case "advanced":
        return "Lanjutan";
      default:
        return level;
    }
  };

  const formatDurasi = (menit: number) => {
    const jam = Math.floor(menit / 60);
    const sisaMenit = menit % 60;

    if (jam > 0) {
      return sisaMenit > 0 ? `${jam}j ${sisaMenit}m` : `${jam} jam`;
    }
    return `${menit} menit`;
  };

  return (
    <Link href={`/kelas/${id}`}>
      <div className="bg-light p-4  min-h-[30rem] rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
        {/* Thumbnail */}
        <div className="relative h-56 overflow-hidden bg-gray-700 rounded-md">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={judul}
              className="object-cover  group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-dark text-4xl">📚</span>
            </div>
          )}

          {/* Badge Level */}
          <div className="absolute top-3 right-3">
            <span
              className={`${getLevelColor(
                level
              )} text-white text-xs px-3 py-1 rounded-full font-semibold`}
            >
              {getLevelText(level)}
            </span>
          </div>

          {/* Badge Kategori */}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
              {kategori}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Judul */}
          <h3 className="text-xl font-bold text-darker mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {judul}
          </h3>

          {/* Deskripsi */}
          <p className="text-dark text-sm mb-4 line-clamp-2">{deskripsi}</p>

          {/* Info Instruktur */}
          <div className="flex items-center mb-4">
            <svg
              className="w-4 h-4 text-gray-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-dark text-sm">{instruktur}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-dark border-t border-dark pt-4">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{jumlahMateri} Materi</span>
            </div>

            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
              </svg>
              <span>{jumlahPeserta} Peserta</span>
            </div>

            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{formatDurasi(durasi)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default KelasCard;
