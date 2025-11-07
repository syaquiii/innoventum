// app/(mahasiswa)/mentor/[id]/components/MentorDetailView.tsx
"use client";

import { Mentor } from "../../hooks/useMentor";

interface MentorDetailViewProps {
  mentor: Mentor;
  onBack: () => void;
  onContact: () => void;
}

export function MentorDetailView({
  mentor,
  onBack,
  onContact,
}: MentorDetailViewProps) {
  const keahlianList = mentor.keahlian.split(",").map((k) => k.trim());

  return (
    <div className="min-h-screen bg-dark">
      <section className="mycontainer text-light py-40">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
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
          Kembali ke Daftar Mentor
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Mentor Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg overflow-hidden sticky top-24">
              {/* Profile Image */}
              <div className="aspect-square bg-gray-700">
                {mentor.foto ? (
                  <img
                    src={mentor.foto}
                    alt={mentor.nama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">{mentor.nama}</h1>

                {/* Status Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      mentor.status === "aktif"
                        ? "bg-green-900/30 text-green-400 border border-green-600"
                        : "bg-red-900/30 text-red-400 border border-red-600"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        mentor.status === "aktif"
                          ? "bg-green-400"
                          : "bg-red-400"
                      }`}
                    ></span>
                    {mentor.status === "aktif" ? "Aktif" : "Non-Aktif"}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  {mentor.email_kontak && (
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-gray-400 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-gray-200">{mentor.email_kontak}</p>
                      </div>
                    </div>
                  )}

                  {mentor.linkedin && (
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-gray-400 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-400">LinkedIn</p>
                        <a
                          className="text-blue-400 hover:underline break-all"
                          href={mentor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {mentor.linkedin}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Button */}
                {mentor.status === "aktif" ? (
                  <button
                    type="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof onContact === "function") onContact();
                    }}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Hubungi Mentor
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full px-6 py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed opacity-70"
                  >
                    Hubungi Mentor
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Keahlian Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                Bidang Keahlian
              </h2>
              <div className="flex flex-wrap gap-2">
                {keahlianList.map((keahlian, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-900/30 text-blue-300 rounded-lg border border-blue-600 text-sm font-medium"
                  >
                    {keahlian}
                  </span>
                ))}
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Tentang Mentor
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {mentor.bio}
              </p>
            </div>

            {/* Administrator Info (if available) */}
            {mentor.administrator?.pengguna && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Informasi Administrator
                </h2>
                <p className="text-gray-300">
                  Dikelola oleh:{" "}
                  <span className="font-medium text-white">
                    {mentor.administrator.pengguna.nama_lengkap}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
