import React, { useState, useEffect, useCallback, useRef } from "react";

interface Materi {
  id: number;
  judul: string;
  urutan: number;
  tipe: string;
  url: string;
  durasi?: number;
  bab?: number;
}

interface KelasMateriSidebarProps {
  materi: Materi[];
  selectedMateriId?: number | null;
  onSelectMateri: (materi: Materi) => void;
  completedMateriIds?: number[];
}

const getMateriIcon = (tipe: string) => {
  const icons = {
    video: "📹",
    dokumen: "📄",
    latihan: "✍️",
  };
  return icons[tipe as keyof typeof icons] || "📋";
};

const getTipeColor = (tipe: string) => {
  const colors = {
    video: "bg-red-500/20 text-red-400 border-red-500/30",
    dokumen: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    latihan: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return colors[tipe as keyof typeof colors] || "bg-gray-500/20 text-gray-400";
};

const KelasMateriSidebar = ({
  materi,
  selectedMateriId,
  onSelectMateri,
  completedMateriIds = [],
}: KelasMateriSidebarProps) => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const findBabForMateri = useCallback(
    (id: number | null | undefined): number => {
      if (!id) return 1;
      const selected = materi?.find((m) => m.id === id);
      return selected?.urutan || 1;
    },
    [materi]
  );

  const [openBab, setOpenBab] = useState<number>(() =>
    findBabForMateri(selectedMateriId)
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setOpenBab(findBabForMateri(selectedMateriId));
  }, [selectedMateriId, findBabForMateri]);

  if (!materi || materi.length === 0) {
    return (
      <div className="bg-[#0f1729] min-h-screen p-6">
        <h2 className="text-3xl font-bold text-white mb-6">Daftar Isi</h2>
        <div className="bg-blue-500 rounded-2xl p-6">
          <p className="text-white text-center">Belum ada materi tersedia</p>
        </div>
      </div>
    );
  }

  const sortedMateri = [...materi].sort((a, b) => a.urutan - b.urutan);

  const groupedMateri = sortedMateri.reduce((acc, item) => {
    const bab = item.urutan;

    if (!acc[bab]) {
      acc[bab] = [];
    }
    acc[bab].push(item);
    return acc;
  }, {} as Record<number, Materi[]>);

  return (
    <div className="min-h-screen">
      <h2 className="text-3xl font-bold text-white mb-6">Daftar Isi</h2>

      <div className="space-y-2">
        {Object.entries(groupedMateri).map(([babNumber, materiList]) => {
          const bab = Number(babNumber);
          const isOpen = openBab === bab;

          const babTitle = materiList[0]?.judul || `Materi ${bab}`;

          return (
            <div
              key={bab}
              className="overflow-hidden rounded-lg bg-[#16213e]/50"
            >
              <button
                onClick={() => setOpenBab(isOpen ? -1 : bab)}
                className="w-full bg-blue-500 hover:bg-blue-600 transition-colors p-4 flex items-center justify-between"
              >
                <span className="text-white text-lg font-semibold text-left">
                  Bab {bab}: {babTitle}
                </span>
                <svg
                  className={`w-5 h-5 text-white transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="p-2 space-y-2">
                  {materiList.map((item) => {
                    const isSelected = selectedMateriId === item.id;
                    const isCompleted = completedMateriIds.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectMateri(item)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                          isSelected
                            ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-purple-500"
                            : "bg-[#1a2744] hover:bg-[#1f2f50] border-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                isCompleted
                                  ? "bg-green-500 text-white"
                                  : isSelected
                                  ? "bg-purple-500 text-white"
                                  : "bg-[#0f1729] text-gray-400"
                              }`}
                            >
                              {isCompleted ? "✓" : item.urutan}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">
                                {getMateriIcon(item.tipe)}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full border ${getTipeColor(
                                  item.tipe
                                )}`}
                              >
                                {item.tipe}
                              </span>
                            </div>

                            <h4
                              className={`font-semibold text-sm mb-1 ${
                                isSelected ? "text-white" : "text-gray-300"
                              }`}
                            >
                              {item.judul}
                            </h4>

                            {item.durasi && (
                              <p className="text-xs text-gray-500">
                                ⏱ {item.durasi} menit
                              </p>
                            )}
                          </div>

                          {isCompleted && (
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl mt-4">
        <button
          onClick={() => setIsSummaryOpen((prev) => !prev)}
          className="w-full bg-blue-500 hover:bg-blue-600 transition-colors p-5 flex items-center justify-between"
        >
          <span className="text-white text-xl font-semibold">Ringkasan</span>
          <svg
            className={`w-6 h-6 text-white transition-transform duration-300 ${
              isSummaryOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <div
          className={`bg-[#16213e]/50 transition-all duration-300 ease-in-out ${
            isSummaryOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {Math.round(
                  (completedMateriIds.length / materi.length) * 100
                ) || 0}
                %
              </div>
              <div className="text-gray-400 text-sm mb-4">
                {completedMateriIds.length} dari {materi.length} materi selesai
              </div>
              <div className="w-full bg-[#0f1729] rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (completedMateriIds.length / materi.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelasMateriSidebar;
