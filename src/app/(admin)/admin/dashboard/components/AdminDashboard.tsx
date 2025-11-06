// components/admin/AdminDashboard.tsx
"use client";

import { DashboardData } from "../hooks/useDashboard";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  BookOpen,
  UserCheck,
  MessageSquare,
  Briefcase,
  TrendingUp,
  RefreshCw,
  Eye,
  MessageCircle,
  Award,
} from "lucide-react";

interface AdminDashboardProps {
  data: DashboardData;
  onRefresh: () => void;
}

const COLORS = {
  primary: ["#3484fb", "#2f77e2", "#2a6ac9", "#1f4f97"],
  success: ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0"],
  warning: ["#F59E0B", "#FBBF24", "#FCD34D", "#FDE68A"],
  purple: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE"],
  accent: ["#c7ff9f", "#b3e68a", "#9fcc75", "#8bb360"],
};

export default function AdminDashboard({
  data,
  onRefresh,
}: AdminDashboardProps) {
  const { stats, charts, activities } = data;

  const statCards = [
    {
      title: "Total Mahasiswa",
      value: stats.totalMahasiswa,
      icon: Users,
      color: "bg-normal",
      gradient: "from-normal via-normal-hover to-normal-active",
    },
    {
      title: "Total Kursus",
      value: stats.totalKursus,
      icon: BookOpen,
      color: "bg-emerald-600",
      gradient: "from-emerald-600 via-emerald-700 to-emerald-800",
    },
    {
      title: "Mentor Aktif",
      value: stats.totalMentor,
      icon: UserCheck,
      color: "bg-purple-600",
      gradient: "from-purple-600 via-purple-700 to-purple-800",
    },
    {
      title: "Total Thread",
      value: stats.totalThread,
      icon: MessageSquare,
      color: "bg-orange-600",
      gradient: "from-orange-600 via-orange-700 to-orange-800",
    },
    {
      title: "Proyek Bisnis",
      value: stats.totalProyek,
      icon: Briefcase,
      color: "bg-pink-600",
      gradient: "from-pink-600 via-pink-700 to-pink-800",
    },
    {
      title: "Tingkat Penyelesaian",
      value: `${stats.completionRate}%`,
      icon: Award,
      color: "bg-cyan-600",
      gradient: "from-cyan-600 via-cyan-700 to-cyan-800",
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-darker">Dashboard Admin</h1>
            <p className="text-dark mt-1">
              Ringkasan dan statistik platform pembelajaran
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-dark border border-gray-700 rounded-lg hover:bg-dark-hover transition shadow-lg text-white"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-dark rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition border border-gray-800"
            >
              <div className={`h-2 bg-gradient-to-r ${stat.gradient}`} />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Enrollment Trend */}
          <div className="bg-dark rounded-xl shadow-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-normal" />
              Tren Enrollment
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={charts.enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f4f97",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ color: "#9ca3af" }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3484fb"
                  strokeWidth={3}
                  dot={{ fill: "#3484fb", r: 5 }}
                  name="Jumlah Enrollment"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Kursus per Level */}
          <div className="bg-dark rounded-xl shadow-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              Distribusi Level Kursus
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={
                    charts.kursusPerLevel as Record<string, string | number>[]
                  }
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ level, percent }) => {
                    const percentNumber =
                      typeof percent === "number"
                        ? percent
                        : Number(percent) || 0;
                    return `${level}: ${(percentNumber * 100).toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {charts.kursusPerLevel.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS.success[index % COLORS.success.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f4f97",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Kursus */}
          <div className="bg-dark rounded-xl shadow-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">
              Top 5 Kursus Populer
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.topKursus} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis
                  type="category"
                  dataKey="judul"
                  width={150}
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f4f97",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="enrollments" fill="#8B5CF6" name="Enrollments" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Proyek */}
          <div className="bg-dark rounded-xl shadow-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-500" />
              Status Proyek Bisnis
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.proyekPerStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="status" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f4f97",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#F59E0B" name="Jumlah Proyek" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Threads */}
          <div className="bg-dark rounded-xl shadow-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-normal" />
              Thread Terpopuler
            </h2>
            <div className="space-y-4">
              {activities.topThreads.map((thread, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-700 rounded-lg hover:bg-dark-hover transition"
                >
                  <h3 className="font-medium text-white mb-2">
                    {thread.judul}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {thread.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {thread.komentar} komentar
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    oleh {thread.author}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Enrollments */}
          <div className="bg-dark rounded-xl shadow-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Aktivitas Terbaru
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {" "}
              {activities.recentEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex items-start gap-3 p-3 border border-gray-700 rounded-lg hover:bg-dark-hover transition"
                >
                  <div className="w-2 h-2 bg-ourgreen rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {enrollment.mahasiswa}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Mendaftar: {enrollment.kursus}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(enrollment.tanggal).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
