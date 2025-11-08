// components/forum/ThreadCard.tsx
import Link from "next/link";
import { MessageSquare, Eye, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ThreadCardProps {
  thread: {
    thread_id: number;
    judul: string;
    isi: string;
    jumlah_views: number;
    jumlah_komentar: number;
    mahasiswa: {
      foto_profil: string | null;
      pengguna: {
        nama_lengkap: string;
      };
    };
  };
}

export default function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <Link
      href={`/diskusi/${thread.thread_id}`}
      className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {thread.mahasiswa.foto_profil ? (
            <img
              src={thread.mahasiswa.foto_profil}
              alt={thread.mahasiswa.pengguna.nama_lengkap}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {thread.judul}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {thread.isi}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="font-medium text-gray-700">
              {thread.mahasiswa.pengguna.nama_lengkap}
            </span>

            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{thread.jumlah_views}</span>
            </div>

            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{thread.jumlah_komentar}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
