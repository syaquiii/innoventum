// components/forum/CommentItem.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { User, Edit2, Trash2, Check, X } from "lucide-react";
import { useDeleteComment, useUpdateComment } from "../hooks/useKomentar";

interface CommentItemProps {
  comment: {
    komentar_id: number;
    isi_komentar: string;
    tanggal_dibuat: string;
    mahasiswa: {
      mahasiswa_id: number;
      foto_profil: string | null;
      pengguna: {
        nama_lengkap: string;
        email: string;
      };
    };
  };
  threadId: number;
  currentUserId?: number;
}

export default function CommentItem({
  comment,
  threadId,
  currentUserId,
}: CommentItemProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.isi_komentar);

  const deleteComment = useDeleteComment(threadId);
  const updateComment = useUpdateComment(threadId);

  const isOwner = currentUserId === comment.mahasiswa.mahasiswa_id;

  const handleUpdate = () => {
    if (!editedText.trim()) return;

    updateComment.mutate(
      {
        commentId: comment.komentar_id,
        data: { isi_komentar: editedText },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Yakin ingin menghapus komentar ini?")) {
      deleteComment.mutate(comment.komentar_id);
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-linear-to-br from-indigo-900 to-indigo-950 border-light border text-light rounded-lg">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {comment.mahasiswa.foto_profil ? (
          <img
            src={comment.mahasiswa.foto_profil}
            alt={comment.mahasiswa.pengguna.nama_lengkap}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-light flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-medium">
              {comment.mahasiswa.pengguna.nama_lengkap}
            </p>
            <p className="text-xs text-white/60">
              {formatDistanceToNow(new Date(comment.tanggal_dibuat), {
                addSuffix: true,
                locale: id,
              })}
            </p>
          </div>

          {/* Actions */}
          {isOwner && !isEditing && (
            <div className="flex gap-2 text-light">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:text-blue-400"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 hover:text-red-400"
                disabled={deleteComment.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Comment Text */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={updateComment.isPending || !editedText.trim()}
                className="px-3 py-1 bg-blue-600 text-light text-sm rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedText(comment.isi_komentar);
                }}
                className="px-3 py-1 bg-red-500 text-sm rounded hover:bg-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">
            {comment.isi_komentar}
          </p>
        )}
      </div>
    </div>
  );
}
