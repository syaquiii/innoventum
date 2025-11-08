// app/(dashboard)/forum/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useThreads } from "../hooks/useThreads";
import ThreadCard from "../components/ThreadCard";

export default function DiskusiContainer() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { data, isLoading, error } = useThreads(page, 10, searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
    setPage(1);
  };

  return (
    <section className="bg-dark">
      <div className="mycontainer py-40">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-light">Forum Diskusi</h1>
            <p className="text-light mt-2">
              Diskusikan ide dan tanyakan pertanyaan Anda
            </p>
          </div>
          <Link
            href="/diskusi/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Buat Thread
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari thread..."
              className="w-full pl-10 pr-4 py-3 border text-light border-light rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>

        {/* Thread List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Gagal memuat threads</p>
          </div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Belum ada thread. Buat yang pertama!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {data?.data.map((thread) => (
                <ThreadCard key={thread.thread_id} thread={thread} />
              ))}
            </div>

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>

                <span className="px-4 py-2 text-gray-700">
                  Halaman {page} dari {data.pagination.totalPages}
                </span>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                  }
                  disabled={page === data.pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
