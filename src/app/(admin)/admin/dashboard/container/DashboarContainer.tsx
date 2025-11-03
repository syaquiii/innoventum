"use client";

import { Loader2 } from "lucide-react";
import { useDashboardData } from "../hooks/useDashboard";
import AdminDashboard from "../components/AdminDashboard";

export default function DashboardContainer() {
  const { data, loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Tidak ada data tersedia</p>
      </div>
    );
  }

  return <AdminDashboard data={data} onRefresh={refetch} />;
}
