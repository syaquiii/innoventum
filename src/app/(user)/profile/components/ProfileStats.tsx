// components/ProfileActivityStats.tsx
"use client";

import { ProfileWithMahasiswa } from "@/app/api/profil/model/profile";
import { MessageSquare, FileText, Briefcase, BookOpen } from "lucide-react";

interface ProfileActivityStatsProps {
  profile: ProfileWithMahasiswa | undefined;
}

export default function ProfileActivityStats({
  profile,
}: ProfileActivityStatsProps) {
  if (!profile?.mahasiswa || !profile.statistik) {
    return null;
  }

  const stats = [
    {
      label: "Thread Dibuat",
      value: profile.statistik.total_threads,
      icon: MessageSquare,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Komentar",
      value: profile.statistik.total_komentar,
      icon: FileText,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Proyek Bisnis",
      value: profile.statistik.total_proyek,
      icon: Briefcase,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Courses Diikuti",
      value: profile.statistik.total_courses,
      icon: BookOpen,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Statistik Aktivitas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
