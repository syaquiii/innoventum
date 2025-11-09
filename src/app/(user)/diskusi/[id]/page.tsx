// app/(dashboard)/forum/[id]/page.tsx
"use client";

import { use } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Eye, MessageSquare, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useThread } from "../hooks/useThreads";
import CommentForm from "../components/CommentForm";
import CommentItem from "../components/CommentItem";
import ThreadCard from "../components/ThreadCard";

interface ThreadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ThreadDetailPage({ params }: ThreadDetailPageProps) {
  const resolvedParams = use(params);
  const threadId = parseInt(resolvedParams.id);
  const { data: session } = useSession();

  const { data, isLoading, error } = useThread(threadId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">Thread tidak ditemukan</p>
          <Link
            href="/forum"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Kembali ke Forum
          </Link>
        </div>
      </div>
    );
  }

  const thread = data.data;

  return (
    <section className="bg-dark">
      <div className="mycontainer py-40">
        {/* Back Button */}
        <Link
          href="/diskusi"
          className="inline-flex items-center gap-2 text-light  mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Forum
        </Link>

        {/* Thread Content */}
        {/* <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex gap-4 mb-6">
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

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {thread.judul}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="font-medium text-gray-700">
                  {thread.mahasiswa.pengguna.nama_lengkap}
                </span>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{thread.jumlah_views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{thread.jumlah_komentar} komentar</span>
                </div>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{thread.isi}</p>
          </div>

        </div> */}
        <div className="space-y-4 mb-6">
            <ThreadCard key={thread.thread_id} thread={thread} />
        </div>

        {/* Comments Section */}
        <div className="bg-linear-to-br from-indigo-900 to-indigo-950 text-light rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-6">
            Komentar ({thread.komentar?.length || 0})
          </h2>

          {/* Comment Form */}
          {session ? (
            <div className="mb-8">
              <CommentForm threadId={threadId} />
            </div>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p>
                Silakan{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  login
                </Link>{" "}
                untuk berkomentar
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {thread.komentar && thread.komentar.length > 0 ? (
              thread.komentar.map((comment: any) => (
                <CommentItem
                  key={comment.komentar_id}
                  comment={comment}
                  threadId={threadId}
                  currentUserId={
                    session?.user?.mahasiswaId
                      ? session.user.mahasiswaId
                      : undefined
                  }
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Belum ada komentar. Jadilah yang pertama berkomentar!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
