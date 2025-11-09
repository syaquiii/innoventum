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
      className="block px-8 py-4 bg-linear-to-br from-indigo-900 to-indigo-950 rounded-lg text-light border border-light"
    >
      <div className="flex flex-col gap-4">
        {/* Avatar */}
        <div className=" flex gap-4 flex-shrink-0 items-center">
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
          <h3 className="text-xl font-bold line-clamp-2">
            {thread.mahasiswa.pengguna.nama_lengkap}
          </h3>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          <p className=" text-base mb-6 line-clamp-2">
            {thread.isi}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-8 text-base">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>{thread.jumlah_komentar}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{thread.jumlah_views}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
