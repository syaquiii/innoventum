import { StatusProyek } from "@prisma/client";
import { ProyekBisnis } from "../hooks/useProyek";

interface ProyekCardProps {
  proyek: ProyekBisnis;
  onEdit: (proyek: ProyekBisnis) => void;
  onDelete: (proyekId: number) => void;
}

const statusColors: Record<StatusProyek, string> = {
  ideas: "bg-purple-100 text-purple-800",
  perencanaan: "bg-blue-100 text-blue-800",
  eksekusi: "bg-yellow-100 text-yellow-800",
  selesai: "bg-green-100 text-green-800",
};

const statusLabels: Record<StatusProyek, string> = {
  ideas: "Ideas",
  perencanaan: "Perencanaan",
  eksekusi: "Eksekusi",
  selesai: "Selesai",
};

export function ProyekCard({ proyek, onEdit, onDelete }: ProyekCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900">
          {proyek.nama_proyek}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[proyek.status_proyek]
          }`}
        >
          {statusLabels[proyek.status_proyek]}
        </span>
      </div>

      {proyek.deskripsi && (
        <p className="text-gray-600 mb-4 line-clamp-3">{proyek.deskripsi}</p>
      )}

      {proyek.dokumen && (
        <div className="mb-4">
          <a
            href={proyek.dokumen}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
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
            Lihat Dokumen
          </a>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(proyek)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(proyek.proyek_id)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
