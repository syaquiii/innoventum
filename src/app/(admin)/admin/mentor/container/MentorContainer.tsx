"use client";

import React, { useState } from "react";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import {
  useCreateMentor,
  useDeleteMentor,
  useMentors,
  useUpdateMentor,
} from "../hooks/useMentor";
import { Popup } from "@/shared/components/popup/NotificationPopup";
import { Mentor } from "@prisma/client";
import { MentorFormData } from "../models/mentor";

const MentorContainer = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [formData, setFormData] = useState<MentorFormData>({
    nama: "",
    bio: "",
    keahlian: "",
    foto: "",
    email_kontak: "",
    linkedin: "",
    status: "aktif",
  });

  // State untuk popup
  const [popup, setPopup] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const { data, isLoading, error } = useMentors({
    page,
    search,
    status,
    limit: 10,
  });
  const createMentor = useCreateMentor();
  const updateMentor = useUpdateMentor();
  const deleteMentor = useDeleteMentor();

  const handleOpenModal = (mentor?: Mentor) => {
    if (mentor) {
      console.log("Editing mentor:", mentor); // Debug log
      setEditingMentor(mentor);
      setFormData({
        nama: mentor.nama,
        bio: mentor.bio,
        keahlian: mentor.keahlian,
        foto: mentor.foto || "",
        email_kontak: mentor.email_kontak,
        linkedin: mentor.linkedin || "",
        status: mentor.status,
      });
    } else {
      setEditingMentor(null);
      setFormData({
        nama: "",
        bio: "",
        keahlian: "",
        foto: "",
        email_kontak: "",
        linkedin: "",
        status: "aktif",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMentor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingMentor) {
        console.log("Updating mentor ID:", editingMentor.mentor_id); // Debug log
        console.log("Update data:", formData); // Debug log

        await updateMentor.mutateAsync({
          id: editingMentor.mentor_id,
          data: formData,
        });
        setPopup({
          message: "Mentor berhasil diperbarui!",
          variant: "success",
        });
      } else {
        await createMentor.mutateAsync(formData);
        setPopup({
          message: "Mentor berhasil ditambahkan!",
          variant: "success",
        });
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error submitting form:", err); // Debug log
      setPopup({
        message:
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat menyimpan data",
        variant: "error",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus mentor ini?")) {
      try {
        console.log("Deleting mentor ID:", id); // Debug log
        await deleteMentor.mutateAsync(id);
        setPopup({
          message: "Mentor berhasil dihapus!",
          variant: "success",
        });
      } catch (err) {
        console.error("Error deleting mentor:", err); // Debug log
        setPopup({
          message:
            err instanceof Error ? err.message : "Gagal menghapus mentor",
          variant: "error",
        });
      }
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-8">
      {/* Popup */}
      {popup && (
        <Popup
          message={popup.message}
          variant={popup.variant}
          onClose={() => setPopup(null)}
          duration={5000}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Mentor</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Tambah Mentor
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari nama atau keahlian..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Foto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Keahlian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.data?.map((mentor: Mentor) => (
              <tr key={mentor.mentor_id}>
                <td className="px-6 py-4">
                  <img
                    src={mentor.foto || "/default-avatar.png"}
                    alt={mentor.nama}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 font-medium">{mentor.nama}</td>
                <td className="px-6 py-4">{mentor.keahlian}</td>
                <td className="px-6 py-4">{mentor.email_kontak}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      mentor.status === "aktif"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {mentor.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(mentor)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(mentor.mentor_id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: data.pagination.totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingMentor ? "Edit Mentor" : "Tambah Mentor"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Keahlian
                </label>
                <input
                  type="text"
                  value={formData.keahlian}
                  onChange={(e) =>
                    setFormData({ ...formData, keahlian: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Kontak
                </label>
                <input
                  type="email"
                  value={formData.email_kontak}
                  onChange={(e) =>
                    setFormData({ ...formData, email_kontak: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  LinkedIn (opsional)
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  URL Foto (opsional)
                </label>
                <input
                  type="text"
                  value={formData.foto}
                  onChange={(e) =>
                    setFormData({ ...formData, foto: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "aktif" | "nonaktif",
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createMentor.isPending || updateMentor.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {createMentor.isPending || updateMentor.isPending
                    ? "Menyimpan..."
                    : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorContainer;
