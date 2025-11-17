"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Loader2,
  MessageSquare,
  Eye,
  User,
  Send,
  Calendar,
} from "lucide-react";
import { useThreadDetail, useCreateKomentar } from "../hooks/useForum";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface ThreadDetailModalProps {
  threadId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onNotification: (notification: {
    message: string;
    variant: "success" | "error";
  }) => void;
}

export default function ThreadDetailModal({
  threadId,
  isOpen,
  onClose,
  onNotification,
}: ThreadDetailModalProps) {
  const [komentarText, setKomentarText] = useState("");

  const { data, isLoading } = useThreadDetail(threadId);
  const createKomentarMutation = useCreateKomentar();

  const handleSubmitKomentar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!threadId || !komentarText.trim()) return;

    createKomentarMutation.mutate(
      {
        threadId,
        data: { isi_komentar: komentarText },
      },
      {
        onSuccess: () => {
          setKomentarText("");
          onNotification({
            message: "Komentar berhasil ditambahkan",
            variant: "success",
          });
        },
        onError: (error: Error) => {
          onNotification({
            message: error.message || "Gagal menambahkan komentar",
            variant: "error",
          });
        },
      }
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: id,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] max-h-[90vh] p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : data?.data ? (
          <>
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-2xl font-bold">
                {data.data.judul}
              </DialogTitle>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{data.data.mahasiswa.pengguna.nama_lengkap}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{data.data.jumlah_views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{data.data.jumlah_komentar} komentar</span>
                </div>
              </div>
            </DialogHeader>

            <Separator />

            <ScrollArea className="max-h-[50vh] px-6 py-4">
              {/* Thread Content */}
              <div className="mb-6">
                <div className="prose max-w-none">
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {data.data.isi}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Comments Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Komentar ({data.data.komentar.length})
                </h3>

                {data.data.komentar.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada komentar. Jadilah yang pertama berkomentar!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.data.komentar.map((komentar) => (
                      <div
                        key={komentar.komentar_id}
                        className="flex gap-3 p-4 bg-muted/30 rounded-lg"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {getInitials(
                              komentar.mahasiswa.pengguna.nama_lengkap
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {komentar.mahasiswa.pengguna.nama_lengkap}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(komentar.tanggal_dibuat)}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {komentar.isi_komentar}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            <Separator />

            {/* Comment Form
            <div className="p-6 pt-4">
              <form onSubmit={handleSubmitKomentar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="komentar" className="text-sm font-medium">
                    Tambah Komentar
                  </Label>
                  <Textarea
                    id="komentar"
                    value={komentarText}
                    onChange={(e) => setKomentarText(e.target.value)}
                    placeholder="Tulis komentar Anda..."
                    rows={3}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      createKomentarMutation.isPending || !komentarText.trim()
                    }
                  >
                    {createKomentarMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Kirim Komentar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div> */}
          </>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            Thread tidak ditemukan
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
