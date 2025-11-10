// components/forum/CreateThreadForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateThread } from "../hooks/useThreads";

interface CreateThreadFormProps {
  onSuccess?: () => void;
}

export default function CreateThreadForm({ onSuccess }: CreateThreadFormProps) {
  const [judul, setJudul] = useState("aa");
  const [isi, setIsi] = useState("");
  const router = useRouter();

  const createThread = useCreateThread();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!judul.trim() || !isi.trim()) {
      return;
    }

    createThread.mutate(
      { judul, isi },
      {
        onSuccess: (data) => {
          setJudul("");
          setIsi("");
          onSuccess?.();
          router.push(`/diskusi/${data.data.thread_id}`);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-linear-to-br p-6 from-indigo-900 to-indigo-950 text-light"
    >
      {/* <div>
        <label
          htmlFor="judul"
          className="block text-sm font-medium mb-2"
        >
          Judul Thread
        </label>
        <input
          type="text"
          id="judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Masukkan judul thread..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-light/60"
          required
          maxLength={200}
        />
      </div> */}

      <div>
        <label htmlFor="isi" className="block text-sm font-medium mb-2">
          Isi Thread
        </label>
        <textarea
          id="isi"
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          placeholder="Tulis pertanyaan atau diskusi Anda..."
          rows={8}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-light/60"
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setJudul("");
            setIsi("");
          }}
          className="px-4 py-2 border border-light rounded-lg hover:bg-red-500 transition-all"
          disabled={createThread.isPending}
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={createThread.isPending || !judul.trim() || !isi.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createThread.isPending ? "Memposting..." : "Posting Thread"}
        </button>
      </div>
    </form>
  );
}
