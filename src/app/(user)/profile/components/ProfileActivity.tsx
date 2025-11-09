// components/ProfileActivityDetails.tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

// Gunakan any untuk prop type, biarkan Prisma handle type inference
interface ProfileActivityDetailsProps {
  profile: any;
}

export default function ProfileActivityDetails({
  profile,
}: ProfileActivityDetailsProps) {
  if (!profile?.mahasiswa) {
    return null;
  }

  const mahasiswa = profile.mahasiswa;
  const threads = mahasiswa.threads || [];
  const komentar = mahasiswa.komentar || [];
  const proyekBisnis = mahasiswa.proyekBisnis || [];
  const enrollments = mahasiswa.enrollments || [];

  // Check jika tidak ada aktivitas sama sekali
  const hasNoActivity =
    threads.length === 0 &&
    komentar.length === 0 &&
    proyekBisnis.length === 0 &&
    enrollments.length === 0;

  if (hasNoActivity) {
    return (
      <div className="mt-8">
        <div className="bg-white rounded-lg border shadow-sm p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Belum Ada Aktivitas
          </h3>
          <p className="text-gray-600">
            Mulai perjalanan belajar Anda dengan mengikuti kursus atau membuat
            thread diskusi
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Threads Terbaru */}
      {threads.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Thread Terbaru
          </h3>
          <div className="space-y-3">
            {threads.map((thread: any) => (
              <div
                key={thread.thread_id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-semibold text-gray-800 mb-1">
                  {thread.judul}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {thread.isi}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{thread.jumlah_views} views</span>
                  <span>• {thread._count?.komentar || 0} komentar</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proyek Bisnis */}
      {proyekBisnis.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Proyek Bisnis
          </h3>
          <div className="space-y-3">
            {proyekBisnis.map((proyek: any) => (
              <div
                key={proyek.proyek_id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {proyek.nama_proyek}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full capitalize ${
                      proyek.status_proyek === "selesai"
                        ? "bg-green-100 text-green-700"
                        : proyek.status_proyek === "eksekusi"
                        ? "bg-blue-100 text-blue-700"
                        : proyek.status_proyek === "perencanaan"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {proyek.status_proyek}
                  </span>
                </div>
                {proyek.deskripsi && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {proyek.deskripsi}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courses yang Diikuti */}
      {enrollments.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Kursus yang Diikuti
          </h3>
          <div className="space-y-3">
            {enrollments.map((enrollment: any) => (
              <div
                key={enrollment.enrollment_id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {enrollment.kursus.judul}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      enrollment.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : enrollment.status === "ongoing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {enrollment.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {enrollment.kursus.deskripsi}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                      {enrollment.kursus.kategori}
                    </span>
                    <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded capitalize">
                      {enrollment.kursus.level}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {Number(enrollment.progres_persen).toFixed(0)}% selesai
                  </span>
                </div>
                <span className="text-xs text-gray-500 mt-2 block">
                  Mulai:{" "}
                  {new Date(enrollment.tanggal_mulai).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Komentar Terbaru */}
      {komentar.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Komentar Terbaru
          </h3>
          <div className="space-y-3">
            {komentar.map((comment: any) => (
              <div
                key={comment.komentar_id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                  {comment.isi_komentar}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 line-clamp-1">
                    Pada: {comment.thread.judul}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatDistanceToNow(new Date(comment.tanggal_dibuat), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
