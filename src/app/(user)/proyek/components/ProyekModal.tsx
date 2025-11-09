import { CreateProyekInput, ProyekBisnis } from "../hooks/useProyek";
import { ProyekForm } from "./ProyekForm";

interface ProyekModalProps {
  isOpen: boolean;
  proyek?: ProyekBisnis;
  onSubmit: (data: CreateProyekInput) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function ProyekModal({
  isOpen,
  proyek,
  onSubmit,
  onClose,
  isLoading,
}: ProyekModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {proyek ? "Edit Proyek Bisnis" : "Buat Proyek Bisnis Baru"}
          </h2>
          <ProyekForm
            proyek={proyek}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
