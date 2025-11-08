// app/(mahasiswa)/mentor/[id]/components/MentorDetailView.tsx
"use client";

import Image from "next/image";
import { Mentor } from "../../hooks/useMentor";
import teacher from "@/shared/assets/mentor/TeacherIllustration.svg"
import { max } from "date-fns";

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
      <section className="mycontainer text-black py-40 space-y-10 flex flex-col items-center">
        <div className="flex w-full">  
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
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
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Keahlian Section */}
            <div className="bg-light rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Pendidikan
              </h2>
              <p>
                S1 Ilmu Komputer – Universitas Brawijaya (2014 – 2077)
              </p>
            </div>

            {/* Description Section */}
            <div className="bg-light rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Pengalaman Kerja
              </h2>
              <ul className="list-disc px-4">
                <li>Digital Marketing Specialist – Arya Digital Solutions (2020 – Sekarang)</li>
                <li>SEO Specialist – Bright Agency (2018 – 2020)</li>
              </ul>
            </div>

            <div className="bg-light rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Pencapaian
              </h2>
              <ul className="list-disc px-4">
                <li>Meningkatkan traffic organik sebesar 150% dalam 6 bulan untuk klien e-commerce.</li>
                <li>Memimpin kampanye iklan yang menghasilkan ROI hingga 300%.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            {/* Keahlian Section */}
            <div className="bg-light rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Kontak
              </h2>
              <ul>
                <li className="list-none">
                  {mentor.email_kontak}
                </li>
                <li className="list-none">
                  {mentor.linkedin}
                </li>
              </ul>
            </div>
            {/* Keahlian Section */}
            <div className="bg-light rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Topik yang Diajarkan
              </h2>
              <ul className="list-disc px-4">
                <li>Strategi Pemasaran Digital</li>
                <li>Cara Efektif Mengembangkan Brand</li>
                <li>Optimasi SEO & SEM untuk Bisnis</li>
                <li>Meningkatkan Engagement di Media Sosial</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-light flex gap-6 px-20 py-6 rounded-full">
          <Image src={teacher.src} alt="" width={230} height={230} className="flex-1" />
          <div className="flex flex-col justify-center flex-[2.5]">
            <p className="text-normal text-5xl font-bold">
              Hubungi
            </p>
            <p className="text-black text-5xl font-bold text-right">
              Sekarang!
            </p>
          </div>
          <div className="flex justify-center items-center flex-1">
            {mentor.status === "aktif" ? (
              <button
                type="button"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof onContact === "function") onContact();
                }}
                className="w-full px-16 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Hubungi
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

        
      </section>
    </div>
  );
}
