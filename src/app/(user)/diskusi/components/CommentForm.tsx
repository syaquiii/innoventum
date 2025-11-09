"use client";

import { useState } from "react";
import { useCreateComment } from "../hooks/useKomentar";

interface CommentFormProps {
  threadId: number;
}

export default function CommentForm({ threadId }: CommentFormProps) {
  const [isiKomentar, setIsiKomentar] = useState("");
  const createComment = useCreateComment(threadId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isiKomentar.trim()) {
      return;
    }

    createComment.mutate(
      { isi_komentar: isiKomentar },
      {
        onSuccess: () => {
          setIsiKomentar("");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label
          htmlFor="komentar"
          className="block text-sm font-medium text-light mb-2"
        >
          Tambah Komentar
        </label>
        <textarea
          id="komentar"
          value={isiKomentar}
          onChange={(e) => setIsiKomentar(e.target.value)}
          placeholder="Tulis komentar Anda..."
          rows={4}
          className="placeholder:text-light/60 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={createComment.isPending || !isiKomentar.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createComment.isPending ? "Mengirim..." : "Kirim Komentar"}
        </button>
      </div>
    </form>
  );
}
