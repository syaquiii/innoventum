"use client";

import React, { useState } from "react";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Impor asli Anda
import {
  useCreateMentor,
  useDeleteMentor,
  useMentors,
  useUpdateMentor,
} from "../hooks/useMentor";
import { Popup } from "@/shared/components/popup/NotificationPopup";
import { Mentor } from "@prisma/client";
import { MentorFormData } from "../models/mentor";

export default function MentorContainer() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState(""); // "" | "aktif" | "nonaktif"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [mentorToDelete, setMentorToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<MentorFormData>({
    nama: "",
    bio: "",
    keahlian: "",
    foto: "",
    email_kontak: "",
    linkedin: "",
    status: "aktif",
  });

  // State untuk popup
  const [popup, setPopup] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const filters = { page, search, status, limit: 10 };
  const { data, isLoading, error } = useMentors(filters);
  const createMentor = useCreateMentor();
  const updateMentor = useUpdateMentor();
  const deleteMentor = useDeleteMentor();

  const handleOpenModal = (mentor?: Mentor) => {
    if (mentor) {
      setEditingMentor(mentor);
      setFormData({
        nama: mentor.nama,
        bio: mentor.bio,
        keahlian: mentor.keahlian,
        foto: mentor.foto || "",
        email_kontak: mentor.email_kontak,
        linkedin: mentor.linkedin || "",
        status: mentor.status,
      });
    } else {
      setEditingMentor(null);
      setFormData({
        nama: "",
        bio: "",
        keahlian: "",
        foto: "",
        email_kontak: "",
        linkedin: "",
        status: "aktif",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMentor(null);
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatus(value === "all" ? "" : value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingMentor) {
        await updateMentor.mutateAsync({
          id: editingMentor.mentor_id,
          data: formData,
        });
        setPopup({
          message: "Mentor berhasil diperbarui!",
          variant: "success",
        });
      } else {
        await createMentor.mutateAsync(formData);
        setPopup({
          message: "Mentor berhasil ditambahkan!",
          variant: "success",
        });
      }
      handleCloseModal();
    } catch (err) {
      setPopup({
        message:
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat menyimpan data",
        variant: "error",
      });
    }
  };

  const handleDelete = (id: number) => {
    setMentorToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!mentorToDelete) return;

    try {
      await deleteMentor.mutateAsync(mentorToDelete);
      setPopup({
        message: "Mentor berhasil dihapus!",
        variant: "success",
      });
    } catch (err) {
      setPopup({
        message: err instanceof Error ? err.message : "Gagal menghapus mentor",
        variant: "error",
      });
    } finally {
      setMentorToDelete(null);
    }
  };

  if (error)
    return (
      <div className="p-8 text-red-500">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  const pagination = data?.pagination;

  return (
    <div className="container mx-auto py-10">
      {popup && (
        <Popup
          message={popup.message}
          variant={popup.variant}
          onClose={() => setPopup(null)}
          duration={3000}
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manajemen Mentor</h1>
        <p className="text-muted-foreground mt-2">
          Kelola data mentor untuk program
        </p>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Cari nama atau keahlian..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="max-w-sm"
          />
          <Button onClick={handleSearch} variant="default">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={status === "" ? "all" : status}
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="aktif">Aktif</SelectItem>
            <SelectItem value="nonaktif">Nonaktif</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Mentor
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Keahlian</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Tidak ada data mentor
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.map((mentor: Mentor) => (
                <TableRow key={mentor.mentor_id}>
                  <TableCell>
                    <img
                      src={
                        mentor.foto ||
                        `https://placehold.co/100x100/E2E8F0/333?text=${mentor.nama
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}`
                      }
                      alt={mentor.nama}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://placehold.co/100x100/E2E8F0/333?text=Err`;
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{mentor.nama}</TableCell>
                  <TableCell>{mentor.keahlian}</TableCell>
                  <TableCell>{mentor.email_kontak}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        mentor.status === "aktif" ? "default" : "outline"
                      }
                      className={
                        mentor.status === "aktif"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {mentor.status === "aktif" ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenModal(mentor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(mentor.mentor_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Menampilkan {(page - 1) * filters.limit + 1} -{" "}
            {Math.min(page * filters.limit, pagination.total)} dari{" "}
            {pagination.total} mentor
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                return (
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - page) <= 1
                );
              })
              .map((p, index, array) => (
                <React.Fragment key={p}>
                  {index > 0 && array[index - 1] !== p - 1 && (
                    <span key={`ellipsis-${p}`} className="px-2">
                      ...
                    </span>
                  )}
                  <Button
                    variant={page === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </Button>
                </React.Fragment>
              ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modal Form - IMPROVED LAYOUT */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingMentor ? "Edit Mentor" : "Tambah Mentor"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 py-4">
            {/* Nama */}
            <div className="space-y-2">
              <Label htmlFor="nama" className="text-sm font-medium">
                Nama <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">
                Bio <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Ceritakan tentang mentor ini..."
                rows={4}
                required
              />
            </div>

            {/* Keahlian */}
            <div className="space-y-2">
              <Label htmlFor="keahlian" className="text-sm font-medium">
                Keahlian <span className="text-red-500">*</span>
              </Label>
              <Input
                id="keahlian"
                value={formData.keahlian}
                onChange={(e) =>
                  setFormData({ ...formData, keahlian: e.target.value })
                }
                placeholder="cth: UI/UX, Data Science, Backend"
                required
              />
            </div>

            {/* Email Kontak */}
            <div className="space-y-2">
              <Label htmlFor="email_kontak" className="text-sm font-medium">
                Email Kontak <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email_kontak"
                type="email"
                value={formData.email_kontak}
                onChange={(e) =>
                  setFormData({ ...formData, email_kontak: e.target.value })
                }
                placeholder="mentor@example.com"
                required
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-sm font-medium">
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            {/* URL Foto */}
            <div className="space-y-2">
              <Label htmlFor="foto" className="text-sm font-medium">
                URL Foto
              </Label>
              <Input
                id="foto"
                type="url"
                value={formData.foto}
                onChange={(e) =>
                  setFormData({ ...formData, foto: e.target.value })
                }
                placeholder="https://example.com/photo.jpg (opsional)"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as "aktif" | "nonaktif",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={createMentor.isPending || updateMentor.isPending}
              >
                {createMentor.isPending || updateMentor.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!mentorToDelete}
        onOpenChange={() => setMentorToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus mentor ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMentor.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMentor.isPending}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteMentor.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
