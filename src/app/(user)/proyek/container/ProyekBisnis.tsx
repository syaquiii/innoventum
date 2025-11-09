// app/mahasiswa/proyek-bisnis/page.tsx
"use client";

import { useState } from "react";
import {
  useProyekBisnisList,
  useCreateProyekBisnis,
  useUpdateProyekBisnis,
  useDeleteProyekBisnis,
  ProyekBisnis,
  CreateProyekInput,
} from "../hooks/useProyek";
import { StatusProyek } from "@prisma/client";
import { ProyekCard } from "../components/ProyekCard";
import { ProyekModal } from "../components/ProyekModal";
import { Popup } from "@/shared/components/popup/NotificationPopup";

interface PopupState {
  message: string;
  variant: "success" | "error" | "info";
}

interface ConfirmDialogState {
  isOpen: boolean;
  proyekId: number | null;
  proyekName: string;
}

export default function ProyekBisnisPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProyek, setSelectedProyek] = useState<
    ProyekBisnis | undefined
  >();
  const [filterStatus, setFilterStatus] = useState<StatusProyek | "all">("all");
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    proyekId: null,
    proyekName: "",
  });

  const { data: proyekList = [], isLoading, error } = useProyekBisnisList();
  const createMutation = useCreateProyekBisnis();
  const updateMutation = useUpdateProyekBisnis(selectedProyek?.proyek_id || 0);
  const deleteMutation = useDeleteProyekBisnis();

  const showPopup = (
    message: string,
    variant: "success" | "error" | "info" = "info"
  ) => {
    setPopup({ message, variant });
  };

  const handleCreate = () => {
    setSelectedProyek(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (proyek: ProyekBisnis) => {
    setSelectedProyek(proyek);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CreateProyekInput) => {
    try {
      if (selectedProyek) {
        await updateMutation.mutateAsync(data);
        showPopup("Proyek berhasil diperbarui!", "success");
      } else {
        await createMutation.mutateAsync(data);
        showPopup("Proyek berhasil dibuat!", "success");
      }
      setIsModalOpen(false);
      setSelectedProyek(undefined);
    } catch (err) {
      showPopup(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan proyek",
        "error"
      );
    }
  };

  const handleDeleteClick = (proyekId: number, proyekName: string) => {
    setConfirmDialog({
      isOpen: true,
      proyekId,
      proyekName,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.proyekId) return;

    try {
      await deleteMutation.mutateAsync(confirmDialog.proyekId);
      showPopup("Proyek berhasil dihapus!", "success");
      setConfirmDialog({ isOpen: false, proyekId: null, proyekName: "" });
    } catch (err) {
      showPopup(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menghapus proyek",
        "error"
      );
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, proyekId: null, proyekName: "" });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProyek(undefined);
  };

  const filteredProyek =
    filterStatus === "all"
      ? proyekList
      : proyekList.filter((p) => p.status_proyek === filterStatus);

  const statusCounts = {
    all: proyekList.length,
    ideas: proyekList.filter((p) => p.status_proyek === StatusProyek.ideas)
      .length,
    perencanaan: proyekList.filter(
      (p) => p.status_proyek === StatusProyek.perencanaan
    ).length,
    eksekusi: proyekList.filter(
      (p) => p.status_proyek === StatusProyek.eksekusi
    ).length,
    selesai: proyekList.filter((p) => p.status_proyek === StatusProyek.selesai)
      .length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Terjadi kesalahan saat memuat data. Silakan coba lagi.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark ">
      <div className="mycontainer py-40">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-light">Proyek Bisnis</h1>
              <p className="text-light mt-1">
                Kelola dan lacak proyek bisnis Anda
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Buat Proyek Baru
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Semua ({statusCounts.all})
            </button>
            <button
              onClick={() => setFilterStatus(StatusProyek.ideas)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === StatusProyek.ideas
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Ideas ({statusCounts.ideas})
            </button>
            <button
              onClick={() => setFilterStatus(StatusProyek.perencanaan)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === StatusProyek.perencanaan
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Perencanaan ({statusCounts.perencanaan})
            </button>
            <button
              onClick={() => setFilterStatus(StatusProyek.eksekusi)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === StatusProyek.eksekusi
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Eksekusi ({statusCounts.eksekusi})
            </button>
            <button
              onClick={() => setFilterStatus(StatusProyek.selesai)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === StatusProyek.selesai
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Selesai ({statusCounts.selesai})
            </button>
          </div>
        </div>

        {/* Proyek List */}
        {filteredProyek.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filterStatus === "all"
                ? "Belum Ada Proyek"
                : `Belum Ada Proyek dengan Status ${filterStatus}`}
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai buat proyek bisnis Anda sekarang
            </p>
            {filterStatus === "all" && (
              <button
                onClick={handleCreate}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Buat Proyek Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProyek.map((proyek) => (
              <ProyekCard
                key={proyek.proyek_id}
                proyek={proyek}
                onEdit={handleEdit}
                onDelete={(id) => handleDeleteClick(id, proyek.nama_proyek)}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <ProyekModal
          isOpen={isModalOpen}
          proyek={selectedProyek}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />

        {/* Confirm Delete Dialog */}
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hapus Proyek?
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus proyek{" "}
                <strong>&quot;{confirmDialog.proyekName}&quot;</strong>?
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup Notification */}
        {popup && (
          <Popup
            message={popup.message}
            variant={popup.variant}
            onClose={() => setPopup(null)}
            duration={5000}
          />
        )}
      </div>
    </div>
  );
}
