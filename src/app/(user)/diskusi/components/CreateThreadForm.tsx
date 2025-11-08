// components/forum/CreateThreadForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateThread } from "../hooks/useThreads";

interface CreateThreadFormProps {
  onSuccess?: () => void;
}

export default function CreateThreadForm({ onSuccess }: CreateThreadFormProps) {
  const [judul, setJudul] = useState("");
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="judul"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Judul Thread
        </label>
        <input
          type="text"
          id="judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Masukkan judul thread..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          maxLength={200}
        />
      </div>

      <div>
        <label
          htmlFor="isi"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Isi Thread
        </label>
        <textarea
          id="isi"
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          placeholder="Tulis pertanyaan atau diskusi Anda..."
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          disabled={createThread.isPending}
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={createThread.isPending || !judul.trim() || !isi.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createThread.isPending ? "Memposting..." : "Posting Thread"}
        </button>
      </div>
    </form>
  );
}
