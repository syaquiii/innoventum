// app/kelas/[id]/components/KelasMateriSection.tsx
import KelasMateriContent from "./KelasMateriContent";
import KelasMateriSidebar from "./KelasSidebar";
interface Materi {
  id: number;
  judul: string;
  urutan: number;
  tipe: string;
  url: string;
  durasi?: number;
}

interface KelasMateriSectionProps {
  materiArray: Materi[];
  selectedMateri: Materi | null;
  completedMateriIds: number[];
  onSelectMateri: (materi: Materi) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onMarkComplete: () => void;
}

const KelasMateriSection = ({
  materiArray,
  selectedMateri,
  completedMateriIds,
  onSelectMateri,
  onPrevious,
  onNext,
  onMarkComplete,
}: KelasMateriSectionProps) => {
  if (!materiArray || materiArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Belum ada materi tersedia</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Materi Pembelajaran</h2>
        <p className="text-gray-400 mt-2">
          {selectedMateri
            ? "Pilih materi dari daftar di samping untuk mulai belajar"
            : "Pilih materi dari daftar di bawah untuk mulai belajar"}
        </p>
      </div>

      {/* Grid: Accordion (kiri) + Konten (kanan) */}
      <div className="grid lg:grid-cols-[350px_1fr] gap-8">
        {/* KOLOM KIRI: Accordion Daftar Materi */}
        <KelasMateriSidebar
          materi={materiArray}
          selectedMateriId={selectedMateri?.id}
          onSelectMateri={onSelectMateri}
          completedMateriIds={completedMateriIds}
        />

        {/* KOLOM KANAN: Konten Materi */}
        <KelasMateriContent
          selectedMateri={selectedMateri}
          onPrevious={onPrevious}
          onNext={onNext}
          onMarkComplete={onMarkComplete}
        />
      </div>
    </div>
  );
};

export default KelasMateriSection;
