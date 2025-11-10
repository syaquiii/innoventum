// app/(dashboard)/forum/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useThreads } from "../hooks/useThreads";
import ThreadCard from "../components/ThreadCard";
import { useAuth } from "@/shared/hooks/useAuth";

export default function DiskusiContainer() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Get auth status
  const { status } = useAuth();

  const { data, isLoading, error } = useThreads(page, 10, searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
    setPage(1);
  };

  // Jika belum login, tampilkan pesan untuk login
  if (status === "unauthenticated") {
    return (
      <section className="bg-dark min-h-screen">
        <div className="mycontainer py-40 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-12 text-center max-w-md">
            <svg
              className="w-16 h-16 text-blue-600 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">
              Login Diperlukan
            </h3>
            <p className="text-gray-400 mb-6">
              Anda harus login terlebih dahulu untuk mengakses forum diskusi
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Login Sekarang
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Jika sedang loading auth
  if (status === "loading") {
    return (
      <section className="bg-dark min-h-screen">
        <div className="mycontainer py-40 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Memeriksa status login...</p>
          </div>
        </div>
      </section>
    );
  }

  // Jika sudah authenticated, tampilkan forum diskusi
  return (
    <section className="bg-dark">
      <div className="mycontainer py-40">
        {/* Header */}
        <div className="flex items-center text- justify-between mb-8">
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
              className="w-full pl-10 pr-4 py-3 border text-light border-light rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800"
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
            <p className="text-gray-400">
              Belum ada thread. Buat yang pertama!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {data?.data.map((thread) => (
                <div
                  key={thread.thread_id}
                  className="hover:scale-105 transition-all hover:shadow-md"
                >
                  <ThreadCard thread={thread} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-700 bg-gray-800 text-light rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>

                <span className="px-4 py-2 text-light">
                  Halaman {page} dari {data.pagination.totalPages}
                </span>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                  }
                  disabled={page === data.pagination.totalPages}
                  className="px-4 py-2 border border-gray-700 bg-gray-800 text-light rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
