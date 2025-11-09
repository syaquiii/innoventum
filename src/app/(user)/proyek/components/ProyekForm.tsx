import { useState, useEffect } from "react";
import { StatusProyek } from "@prisma/client";
import { CreateProyekInput, ProyekBisnis } from "../hooks/useProyek";

interface ProyekFormProps {
  proyek?: ProyekBisnis;
  onSubmit: (data: CreateProyekInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProyekForm({
  proyek,
  onSubmit,
  onCancel,
  isLoading,
}: ProyekFormProps) {
  const [formData, setFormData] = useState<CreateProyekInput>({
    nama_proyek: "",
    deskripsi: "",
    status_proyek: StatusProyek.ideas,
    dokumen: "",
  });

  useEffect(() => {
    if (proyek) {
      setFormData({
        nama_proyek: proyek.nama_proyek,
        deskripsi: proyek.deskripsi || "",
        status_proyek: proyek.status_proyek,
        dokumen: proyek.dokumen || "",
      });
    }
  }, [proyek]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Proyek <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.nama_proyek}
          onChange={(e) =>
            setFormData({ ...formData, nama_proyek: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Masukkan nama proyek"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          value={formData.deskripsi}
          onChange={(e) =>
            setFormData({ ...formData, deskripsi: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Deskripsikan proyek Anda"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status Proyek <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.status_proyek}
          onChange={(e) =>
            setFormData({
              ...formData,
              status_proyek: e.target.value as StatusProyek,
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value={StatusProyek.ideas}>Ideas</option>
          <option value={StatusProyek.perencanaan}>Perencanaan</option>
          <option value={StatusProyek.eksekusi}>Eksekusi</option>
          <option value={StatusProyek.selesai}>Selesai</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL Dokumen
        </label>
        <input
          type="url"
          value={formData.dokumen}
          onChange={(e) =>
            setFormData({ ...formData, dokumen: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading
            ? "Menyimpan..."
            : proyek
            ? "Update Proyek"
            : "Buat Proyek"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors font-medium"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
