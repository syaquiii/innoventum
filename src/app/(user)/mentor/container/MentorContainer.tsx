// app/(mahasiswa)/mentor/page.tsx
"use client";

import { useState } from "react";
import { useMentor, useMentors } from "../hooks/useMentor";
import { MentorCard } from "../components/MentorCard";
import Link from "next/link";
export default function MentorPage() {
  const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null);
  const [selectedKeahlian, setSelectedKeahlian] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: mentors, isLoading, error } = useMentors();
  const { data: selectedMentor } = useMentor(selectedMentorId || 0);

  const keahlianList = [
    "Semua",
    "Digital Marketing",
    "SEO & SEM",
    "Content Marketing",
    "Social Media",
    "Email Marketing",
  ];
  const statusList = [
    { value: "", label: "Semua Status" },
    { value: "aktif", label: "Aktif" },
    { value: "nonaktif", label: "Non-Aktif" },
  ];

  // Filter mentors
  const filteredMentors = mentors?.filter((mentor) => {
    const matchKeahlian =
      !selectedKeahlian ||
      selectedKeahlian === "Semua" ||
      mentor.keahlian.toLowerCase().includes(selectedKeahlian.toLowerCase());
    const matchStatus = !selectedStatus || mentor.status === selectedStatus;
    const matchSearch =
      !searchQuery ||
      mentor.nama.toLowerCase().includes(searchQuery.toLowerCase());

    return matchKeahlian && matchStatus && matchSearch;
  });

  const handleViewDetails = (id: number) => {
    setSelectedMentorId(id);
  };

  const handleCloseModal = () => {
    setSelectedMentorId(null);
  };

  const handleResetFilter = () => {
    setSelectedKeahlian("");
    setSelectedStatus("");
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data mentor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Gagal memuat data mentor</p>
          <p className="text-sm">Silakan refresh halaman</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <section className="mycontainer flex gap-10 text-light py-40 w-full">
        {/* Sidebar Filter - 2/12 */}
        <div className="w-2/12">
          <div className="sticky top-24">
            {/* Filter Keahlian */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Keahlian</h3>
              <div className="space-y-2">
                {keahlianList.map((keahlian) => (
                  <button
                    key={keahlian}
                    onClick={() =>
                      setSelectedKeahlian(keahlian === "Semua" ? "" : keahlian)
                    }
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      (keahlian === "Semua" && !selectedKeahlian) ||
                      selectedKeahlian === keahlian
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {keahlian}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Status */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Status</h3>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 focus:border-blue-600 focus:outline-none"
              >
                {statusList.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filter */}
            {(selectedKeahlian || selectedStatus || searchQuery) && (
              <button
                onClick={handleResetFilter}
                className="w-full mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Main Content - 10/12 */}
        <div className="w-10/12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Hubungi Mentor</h1>
            <p className="text-gray-400">
              Temukan mentor terbaik untuk membimbing perjalanan bisnis Anda
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="h-64 bg-gray-700"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 text-center">
              <svg
                className="w-12 h-12 text-red-600 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                Terjadi Kesalahan
              </h3>
              <p className="text-gray-400">
                Gagal memuat data mentor. Silakan coba lagi.
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredMentors?.length === 0 && (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-600 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Tidak Ada Mentor
              </h3>
              <p className="text-gray-500">
                Tidak ada mentor yang sesuai dengan filter yang dipilih.
              </p>
            </div>
          )}

          {/* Mentor Cards */}
          {!isLoading &&
            !error &&
            filteredMentors &&
            filteredMentors.length > 0 && (
              <div className="space-y-6 grid grid-cols-2">
                {filteredMentors.map((mentor) => (
                  <Link
                    key={mentor.mentor_id}
                    href={`/mentor/${mentor.mentor_id}`}
                    className="block"
                  >
                    <MentorCard
                      key={mentor.mentor_id}
                      mentor={mentor}
                      onViewDetails={handleViewDetails}
                    />
                  </Link>
                ))}
              </div>
            )}
        </div>
      </section>
    </div>
  );
}
