// app/kelas/[id]/components/KelasOverview.tsx

import { Button } from "@/components/ui/button";

interface KelasOverviewProps {
  kelas: any;
  isEnrolling: boolean;
  onEnroll: () => void;
}

const KelasOverview = ({
  kelas,
  isEnrolling,
  onEnroll,
}: KelasOverviewProps) => {
  const isEnrolled = kelas.isEnrolled || false;

  return (
    <div className="bg-light rounded-2xl p-8 h-fit">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang Kelas</h2>

      <div className="prose prose-lg max-w-none text-gray-800">
        <p className="mb-6 leading-relaxed">{kelas.deskripsi}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>
              Materi lengkap dengan {kelas.statistik.jumlahVideo} video,{" "}
              {kelas.statistik.jumlahDokumen} dokumen, dan{" "}
              {kelas.statistik.jumlahLatihan} latihan
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>
              Sudah diikuti oleh {kelas.statistik.jumlahPeserta} peserta
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Akses selamanya setelah mendaftar</span>
          </div>
        </div>

        {/* Enroll Button */}
        {!isEnrolled && (
          <Button
            variant={"normal"}
            className="w-full "
            onClick={onEnroll}
            disabled={isEnrolling}
          >
            {isEnrolling ? "Enrolling" : "Enroll"}
          </Button>
        )}

        {isEnrolled && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
            <span className="text-green-700 font-semibold">
              ✓ Anda sudah terdaftar di kelas ini
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KelasOverview;
