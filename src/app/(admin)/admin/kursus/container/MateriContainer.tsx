// app/admin/kursus/container/MateriContainer.tsx
"use client";

import { useState } from "react";
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
import {
  Search,
  Edit,
  Trash2,
  Loader2,
  Plus,
  FileText,
  Video,
  BookOpen,
  FileCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminMateri,
  useDeleteMateri,
  useAdminMateriDetail,
  useUpdateMateri,
  useCreateMateri,
  MateriFilters,
  CreateMateriData,
  UpdateMateriData,
} from "../hooks/useAdminMateri";
import { Popup } from "@/shared/components/popup/NotificationPopup";

interface MateriContainerProps {
  kursusId?: number;
  onClose?: () => void;
}

export default function MateriContainer({
  kursusId,
  onClose,
}: MateriContainerProps) {
  const [filters, setFilters] = useState<MateriFilters>({
    page: 1,
    limit: 10,
    search: "",
    kursus_id: kursusId?.toString() || "",
    tipe_konten: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [materiToDelete, setMateriToDelete] = useState<number | null>(null);

  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [materiToEditId, setMateriToEditId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<UpdateMateriData>>(
    {}
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateMateriData>({
    kursus_id: kursusId || 0,
    judul_materi: "",
    urutan: 1,
    tipe_konten: "video",
    url_konten: "",
    durasi_menit: 0,
  });

  const { data, isLoading, isError } = useAdminMateri(filters);
  const deleteMutation = useDeleteMateri();
  const updateMateriMutation = useUpdateMateri();
  const createMateriMutation = useCreateMateri();

  const { data: editingMateriData, isLoading: isLoadingMateri } =
    useAdminMateriDetail(materiToEditId);

  const handleSearch = () => {
    setFilters({ ...filters, search: searchInput, page: 1 });
  };

  const handleTipeKontenFilter = (value: string) => {
    setFilters({
      ...filters,
      tipe_konten: value === "all" ? "" : value,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleDelete = () => {
    if (materiToDelete) {
      deleteMutation.mutate(materiToDelete, {
        onSuccess: () => {
          setMateriToDelete(null);
          setNotification({
            message: "Materi berhasil dihapus",
            variant: "success",
          });
        },
        onError: (error: Error) => {
          setNotification({
            message: error.message || "Gagal menghapus materi",
            variant: "error",
          });
        },
      });
    }
  };

  const handleOpenEditModal = (materiId: number) => {
    setMateriToEditId(materiId);
    setIsEditModalOpen(true);
    setEditFormData({});
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setMateriToEditId(null);
    setEditFormData({});
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    const nextUrutan =
      data?.data.filter((m) => m.kursus_id === kursusId).length || 0;
    setCreateFormData({
      kursus_id: kursusId || 0,
      judul_materi: "",
      urutan: nextUrutan + 1,
      tipe_konten: "video",
      url_konten: "",
      durasi_menit: 0,
    });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({
      kursus_id: kursusId || 0,
      judul_materi: "",
      urutan: 1,
      tipe_konten: "video",
      url_konten: "",
      durasi_menit: 0,
    });
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setEditFormData((prev) => {
      if (Object.keys(prev).length === 0 && editingMateriData) {
        const materi = editingMateriData.data;
        return {
          kursus_id: materi.kursus_id,
          judul_materi: materi.judul_materi,
          urutan: materi.urutan,
          tipe_konten: materi.tipe_konten,
          url_konten: materi.url_konten,
          durasi_menit: materi.durasi_menit,
          [id]:
            id === "urutan" || id === "durasi_menit"
              ? parseInt(value) || 0
              : value,
        };
      }
      return {
        ...prev,
        [id]:
          id === "urutan" || id === "durasi_menit"
            ? parseInt(value) || 0
            : value,
      };
    });
  };

  const handleEditSelectChange = (field: string, value: string) => {
    setEditFormData((prev) => {
      if (Object.keys(prev).length === 0 && editingMateriData) {
        const materi = editingMateriData.data;
        return {
          kursus_id: materi.kursus_id,
          judul_materi: materi.judul_materi,
          urutan: materi.urutan,
          tipe_konten: materi.tipe_konten,
          url_konten: materi.url_konten,
          durasi_menit: materi.durasi_menit,
          [field]: value,
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleCreateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [id]:
        id === "urutan" || id === "durasi_menit" ? parseInt(value) || 0 : value,
    }));
  };

  const handleCreateSelectChange = (field: string, value: string) => {
    setCreateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materiToEditId) return;

    const formData =
      Object.keys(editFormData).length === 0 && editingMateriData
        ? {
            kursus_id: editingMateriData.data.kursus_id,
            judul_materi: editingMateriData.data.judul_materi,
            urutan: editingMateriData.data.urutan,
            tipe_konten: editingMateriData.data.tipe_konten,
            url_konten: editingMateriData.data.url_konten,
            durasi_menit: editingMateriData.data.durasi_menit,
          }
        : editFormData;

    const dataToUpdate: Partial<UpdateMateriData> = {};
    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof UpdateMateriData;
      if (formData[typedKey] !== "" && formData[typedKey] !== null) {
        dataToUpdate[typedKey] = formData[typedKey] as any;
      }
    });

    updateMateriMutation.mutate(
      { materiId: materiToEditId, data: dataToUpdate },
      {
        onSuccess: () => {
          handleCloseEditModal();
          setNotification({
            message: "Materi berhasil diperbarui",
            variant: "success",
          });
        },
        onError: (error: Error) => {
          setNotification({
            message: error.message || "Gagal memperbarui materi",
            variant: "error",
          });
        },
      }
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createMateriMutation.mutate(createFormData, {
      onSuccess: () => {
        handleCloseCreateModal();
        setNotification({
          message: "Materi berhasil ditambahkan",
          variant: "success",
        });
      },
      onError: (error: Error) => {
        setNotification({
          message: error.message || "Gagal menambahkan materi",
          variant: "error",
        });
      },
    });
  };

  const getTipeKontenBadge = (tipe: string) => {
    const config: Record<
      string,
      { variant: string; label: string; icon: any }
    > = {
      video: { variant: "default", label: "Video", icon: Video },
      dokumen: { variant: "secondary", label: "Dokumen", icon: FileText },
      latihan: { variant: "outline", label: "Latihan", icon: FileCheck },
    };
    const item = config[tipe] || {
      variant: "secondary",
      label: tipe,
      icon: BookOpen,
    };
    const Icon = item.icon;
    return (
      <Badge variant={item.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {item.label}
      </Badge>
    );
  };

  const getEditFormValue = (field: keyof UpdateMateriData): any => {
    if (editFormData[field] !== undefined) {
      return editFormData[field];
    }
    if (editingMateriData) {
      const materi = editingMateriData.data;
      return materi[field as keyof typeof materi] || "";
    }
    return "";
  };

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        Gagal memuat data materi. Silakan coba lagi.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Popup
        message={notification?.message}
        variant={notification?.variant}
        onClose={() => setNotification(null)}
        duration={5000}
      />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Materi</h2>
          <p className="text-muted-foreground mt-1">
            Kelola materi pembelajaran untuk kursus
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleOpenCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Materi
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Cari judul materi..."
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
          value={filters.tipe_konten === "" ? "all" : filters.tipe_konten}
          onValueChange={handleTipeKontenFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="dokumen">Dokumen</SelectItem>
            <SelectItem value="latihan">Latihan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Urutan</TableHead>
              <TableHead>Judul Materi</TableHead>
              <TableHead>Kursus</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Durasi</TableHead>
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
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Tidak ada data materi
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((materi) => (
                <TableRow key={materi.materi_id}>
                  <TableCell className="font-medium">{materi.urutan}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium truncate">
                        {materi.judul_materi}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {materi.url_konten}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{materi.kursus.judul}</div>
                      <div className="text-muted-foreground">
                        {materi.kursus.kategori}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTipeKontenBadge(materi.tipe_konten)}
                  </TableCell>
                  <TableCell>
                    {materi.durasi_menit ? `${materi.durasi_menit} menit` : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEditModal(materi.materi_id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setMateriToDelete(materi.materi_id)}
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

      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {(filters.page! - 1) * filters.limit! + 1} -{" "}
            {Math.min(filters.page! * filters.limit!, data.pagination.total)}{" "}
            dari {data.pagination.total} materi
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page! - 1)}
              disabled={filters.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page! + 1)}
              disabled={filters.page === data.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AlertDialog
        open={!!materiToDelete}
        onOpenChange={() => setMateriToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus materi ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteMutation.isPending ? (
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

      <Dialog open={isCreateModalOpen} onOpenChange={handleCloseCreateModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Tambah Materi Baru
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="judul_materi" className="text-sm font-medium">
                Judul Materi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="judul_materi"
                value={createFormData.judul_materi}
                onChange={handleCreateFormChange}
                placeholder="Masukkan judul materi"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="urutan" className="text-sm font-medium">
                  Urutan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="urutan"
                  type="number"
                  value={createFormData.urutan}
                  onChange={handleCreateFormChange}
                  placeholder="1"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipe_konten" className="text-sm font-medium">
                  Tipe Konten <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={createFormData.tipe_konten}
                  onValueChange={(value) =>
                    handleCreateSelectChange("tipe_konten", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="dokumen">Dokumen</SelectItem>
                    <SelectItem value="latihan">Latihan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url_konten" className="text-sm font-medium">
                URL Konten <span className="text-red-500">*</span>
              </Label>
              <Input
                id="url_konten"
                value={createFormData.url_konten}
                onChange={handleCreateFormChange}
                placeholder="https://example.com/video.mp4"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="durasi_menit" className="text-sm font-medium">
                Durasi (menit)
              </Label>
              <Input
                id="durasi_menit"
                type="number"
                value={createFormData.durasi_menit}
                onChange={handleCreateFormChange}
                placeholder="0"
                min="0"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" disabled={createMateriMutation.isPending}>
                {createMateriMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Tambah Materi"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Materi
            </DialogTitle>
          </DialogHeader>
          {isLoadingMateri ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="judul_materi" className="text-sm font-medium">
                  Judul Materi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="judul_materi"
                  value={getEditFormValue("judul_materi")}
                  onChange={handleEditFormChange}
                  placeholder="Masukkan judul materi"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="urutan" className="text-sm font-medium">
                    Urutan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="urutan"
                    type="number"
                    value={getEditFormValue("urutan")}
                    onChange={handleEditFormChange}
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipe_konten" className="text-sm font-medium">
                    Tipe Konten <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={getEditFormValue("tipe_konten")}
                    onValueChange={(value) =>
                      handleEditSelectChange("tipe_konten", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="dokumen">Dokumen</SelectItem>
                      <SelectItem value="latihan">Latihan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url_konten" className="text-sm font-medium">
                  URL Konten <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="url_konten"
                  value={getEditFormValue("url_konten")}
                  onChange={handleEditFormChange}
                  placeholder="https://example.com/video.mp4"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="durasi_menit" className="text-sm font-medium">
                  Durasi (menit)
                </Label>
                <Input
                  id="durasi_menit"
                  type="number"
                  value={getEditFormValue("durasi_menit") || ""}
                  onChange={handleEditFormChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={updateMateriMutation.isPending}>
                  {updateMateriMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
