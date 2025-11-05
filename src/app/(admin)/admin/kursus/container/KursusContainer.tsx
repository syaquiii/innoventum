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
  BookOpen,
  List,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminKursus,
  useDeleteKursus,
  useAdminKursusDetail,
  useUpdateKursus,
  useCreateKursus,
  KursusFilters,
  CreateKursusData,
  UpdateKursusData,
} from "../hooks/useAdminKursus";
import { Popup } from "@/shared/components/popup/NotificationPopup";
import MateriContainer from "./MateriContainer";

export default function AdminKursusPage() {
  const [filters, setFilters] = useState<KursusFilters>({
    page: 1,
    limit: 10,
    search: "",
    kategori: "",
    level: "",
    status: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [kursusToDelete, setKursusToDelete] = useState<number | null>(null);

  // State untuk notification popup
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  // State untuk modal edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [kursusToEditId, setKursusToEditId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<UpdateKursusData>>(
    {}
  );

  // State untuk modal create
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateKursusData>({
    judul: "",
    deskripsi: "",
    kategori: "",
    thumbnail: "",
    durasi_menit: 0,
    level: "beginner",
    status: "draft",
  });

  // State untuk modal materi
  const [isMateriModalOpen, setIsMateriModalOpen] = useState(false);
  const [selectedKursusId, setSelectedKursusId] = useState<number | null>(null);

  const { data, isLoading, isError } = useAdminKursus(filters);
  const deleteMutation = useDeleteKursus();
  const updateKursusMutation = useUpdateKursus();
  const createKursusMutation = useCreateKursus();

  // Hook untuk mengambil data kursus yang akan diedit
  const { data: editingKursusData, isLoading: isLoadingKursus } =
    useAdminKursusDetail(kursusToEditId);

  const handleSearch = () => {
    setFilters({ ...filters, search: searchInput, page: 1 });
  };

  const handleKategoriFilter = (value: string) => {
    setFilters({
      ...filters,
      kategori: value === "all" ? "" : value,
      page: 1,
    });
  };

  const handleLevelFilter = (value: string) => {
    setFilters({
      ...filters,
      level: value === "all" ? "" : (value as KursusFilters["level"]),
      page: 1,
    });
  };

  const handleStatusFilter = (value: string) => {
    setFilters({
      ...filters,
      status: value === "all" ? "" : (value as KursusFilters["status"]),
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  // Handler hapus
  const handleDelete = () => {
    if (kursusToDelete) {
      deleteMutation.mutate(kursusToDelete, {
        onSuccess: () => {
          setKursusToDelete(null);
          setNotification({
            message: "Kursus berhasil dihapus",
            variant: "success",
          });
        },
        onError: (error: Error) => {
          setNotification({
            message: error.message || "Gagal menghapus kursus",
            variant: "error",
          });
        },
      });
    }
  };

  const handleOpenEditModal = (kursusId: number) => {
    setKursusToEditId(kursusId);
    setIsEditModalOpen(true);
    setEditFormData({});
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setKursusToEditId(null);
    setEditFormData({});
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateFormData({
      judul: "",
      deskripsi: "",
      kategori: "",
      thumbnail: "",
      durasi_menit: 0,
      level: "beginner",
      status: "draft",
    });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({
      judul: "",
      deskripsi: "",
      kategori: "",
      thumbnail: "",
      durasi_menit: 0,
      level: "beginner",
      status: "draft",
    });
  };

  // Handler untuk modal materi
  const handleOpenMateriModal = (kursusId: number) => {
    setSelectedKursusId(kursusId);
    setIsMateriModalOpen(true);
  };

  const handleCloseMateriModal = () => {
    setIsMateriModalOpen(false);
    setSelectedKursusId(null);
  };

  // Handler untuk perubahan form edit
  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setEditFormData((prev) => {
      if (Object.keys(prev).length === 0 && editingKursusData) {
        const kursus = editingKursusData.data;
        return {
          judul: kursus.judul,
          deskripsi: kursus.deskripsi,
          kategori: kursus.kategori,
          thumbnail: kursus.thumbnail || "",
          durasi_menit: kursus.durasi_menit,
          level: kursus.level,
          status: kursus.status,
          [id]: id === "durasi_menit" ? parseInt(value) || 0 : value,
        };
      }
      return {
        ...prev,
        [id]: id === "durasi_menit" ? parseInt(value) || 0 : value,
      };
    });
  };

  // Handler select untuk edit form
  const handleEditSelectChange = (field: string, value: string) => {
    setEditFormData((prev) => {
      if (Object.keys(prev).length === 0 && editingKursusData) {
        const kursus = editingKursusData.data;
        return {
          judul: kursus.judul,
          deskripsi: kursus.deskripsi,
          kategori: kursus.kategori,
          thumbnail: kursus.thumbnail || "",
          durasi_menit: kursus.durasi_menit,
          level: kursus.level,
          status: kursus.status,
          [field]: value,
        };
      }
      return { ...prev, [field]: value };
    });
  };

  // Handler perubahan form create
  const handleCreateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [id]: id === "durasi_menit" ? parseInt(value) || 0 : value,
    }));
  };

  // Handler select untuk create form
  const handleCreateSelectChange = (field: string, value: string) => {
    setCreateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler submit edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kursusToEditId) return;

    const formData =
      Object.keys(editFormData).length === 0 && editingKursusData
        ? {
            judul: editingKursusData.data.judul,
            deskripsi: editingKursusData.data.deskripsi,
            kategori: editingKursusData.data.kategori,
            thumbnail: editingKursusData.data.thumbnail || "",
            durasi_menit: editingKursusData.data.durasi_menit,
            level: editingKursusData.data.level,
            status: editingKursusData.data.status,
          }
        : editFormData;

    const dataToUpdate: Partial<UpdateKursusData> = {};
    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof UpdateKursusData;
      if (formData[typedKey] !== "" && formData[typedKey] !== null) {
        dataToUpdate[typedKey] = formData[typedKey] as any;
      }
    });

    updateKursusMutation.mutate(
      { kursusId: kursusToEditId, data: dataToUpdate },
      {
        onSuccess: () => {
          handleCloseEditModal();
          setNotification({
            message: "Kursus berhasil diperbarui",
            variant: "success",
          });
        },
        onError: (error: Error) => {
          setNotification({
            message: error.message || "Gagal memperbarui kursus",
            variant: "error",
          });
        },
      }
    );
  };

  // Handler submit create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createKursusMutation.mutate(createFormData, {
      onSuccess: () => {
        handleCloseCreateModal();
        setNotification({
          message: "Kursus berhasil ditambahkan",
          variant: "success",
        });
      },
      onError: (error: Error) => {
        setNotification({
          message: error.message || "Gagal menambahkan kursus",
          variant: "error",
        });
      },
    });
  };

  // Helper badge level kursus
  const getLevelBadge = (level: string) => {
    const variants: Record<string, string> = {
      beginner: "default",
      intermediate: "secondary",
      advanced: "destructive",
    };
    const labels: Record<string, string> = {
      beginner: "Pemula",
      intermediate: "Menengah",
      advanced: "Lanjutan",
    };
    return (
      <Badge variant={variants[level] as any}>{labels[level] || level}</Badge>
    );
  };

  // Helper badge status kursus
  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: string; label: string }> = {
      draft: { variant: "secondary", label: "Draft" },
      published: { variant: "default", label: "Published" },
      archived: { variant: "outline", label: "Archived" },
    };
    const item = config[status] || { variant: "secondary", label: status };
    return <Badge variant={item.variant as any}>{item.label}</Badge>;
  };

  // Helper untuk mengambil nilai field edit form
  const getEditFormValue = (field: keyof UpdateKursusData): any => {
    if (editFormData[field] !== undefined) {
      return editFormData[field];
    }
    if (editingKursusData) {
      const kursus = editingKursusData.data;
      return kursus[field as keyof typeof kursus] || "";
    }
    return "";
  };

  if (isError) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-500">
          Gagal memuat data kursus. Silakan coba lagi.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Popup
        message={notification?.message}
        variant={notification?.variant}
        onClose={() => setNotification(null)}
        duration={5000}
      />

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Kursus</h1>
          <p className="text-muted-foreground mt-2">
            Kelola kursus dan materi pembelajaran
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kursus
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Cari judul atau deskripsi..."
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
          value={filters.level === "" ? "all" : filters.level}
          onValueChange={handleLevelFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Level</SelectItem>
            <SelectItem value="beginner">Pemula</SelectItem>
            <SelectItem value="intermediate">Menengah</SelectItem>
            <SelectItem value="advanced">Lanjutan</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status === "" ? "all" : filters.status}
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrollment</TableHead>
              <TableHead>Materi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  Tidak ada data kursus
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((kursus) => (
                <TableRow key={kursus.kursus_id}>
                  <TableCell className="font-medium">
                    {kursus.kursus_id}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium truncate">{kursus.judul}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {kursus.deskripsi}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{kursus.kategori}</TableCell>
                  <TableCell>{getLevelBadge(kursus.level)}</TableCell>
                  <TableCell>{kursus.durasi_menit} menit</TableCell>
                  <TableCell>{getStatusBadge(kursus.status)}</TableCell>
                  <TableCell>{kursus._count.enrollments}</TableCell>
                  <TableCell>{kursus._count.materi}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenMateriModal(kursus.kursus_id)}
                        title="Kelola Materi"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEditModal(kursus.kursus_id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setKursusToDelete(kursus.kursus_id)}
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
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Menampilkan {(filters.page! - 1) * filters.limit! + 1} -{" "}
            {Math.min(filters.page! * filters.limit!, data.pagination.total)}{" "}
            dari {data.pagination.total} kursus
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
            {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1)
              .filter((page) => {
                const currentPage = filters.page!;
                return (
                  page === 1 ||
                  page === data.pagination.totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, index, array) => (
                <>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span key={`ellipsis-${page}`} className="px-2">
                      ...
                    </span>
                  )}
                  <Button
                    key={page}
                    variant={filters.page === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                </>
              ))}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!kursusToDelete}
        onOpenChange={() => setKursusToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kursus ini? Tindakan ini tidak
              dapat dibatalkan dan akan menghapus semua materi terkait.
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

      {/* Modal Create Kursus */}
      <Dialog open={isCreateModalOpen} onOpenChange={handleCloseCreateModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Tambah Kursus Baru
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="judul" className="text-sm font-medium">
                Judul Kursus <span className="text-red-500">*</span>
              </Label>
              <Input
                id="judul"
                value={createFormData.judul}
                onChange={handleCreateFormChange}
                placeholder="Masukkan judul kursus"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi" className="text-sm font-medium">
                Deskripsi <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="deskripsi"
                value={createFormData.deskripsi}
                onChange={handleCreateFormChange}
                placeholder="Masukkan deskripsi kursus"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kategori" className="text-sm font-medium">
                  Kategori <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="kategori"
                  value={createFormData.kategori}
                  onChange={handleCreateFormChange}
                  placeholder="e.g. Programming, Design"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="durasi_menit" className="text-sm font-medium">
                  Durasi (menit) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="durasi_menit"
                  type="number"
                  value={createFormData.durasi_menit}
                  onChange={handleCreateFormChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail" className="text-sm font-medium">
                URL Thumbnail
              </Label>
              <Input
                id="thumbnail"
                value={createFormData.thumbnail}
                onChange={handleCreateFormChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-medium">
                  Level <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={createFormData.level}
                  onValueChange={(value) =>
                    handleCreateSelectChange("level", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Pemula</SelectItem>
                    <SelectItem value="intermediate">Menengah</SelectItem>
                    <SelectItem value="advanced">Lanjutan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={createFormData.status}
                  onValueChange={(value) =>
                    handleCreateSelectChange("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" disabled={createKursusMutation.isPending}>
                {createKursusMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Tambah Kursus"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Kursus */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Kursus
            </DialogTitle>
          </DialogHeader>
          {isLoadingKursus ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="judul" className="text-sm font-medium">
                  Judul Kursus <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="judul"
                  value={getEditFormValue("judul")}
                  onChange={handleEditFormChange}
                  placeholder="Masukkan judul kursus"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi" className="text-sm font-medium">
                  Deskripsi <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="deskripsi"
                  value={getEditFormValue("deskripsi")}
                  onChange={handleEditFormChange}
                  placeholder="Masukkan deskripsi kursus"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kategori" className="text-sm font-medium">
                    Kategori <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="kategori"
                    value={getEditFormValue("kategori")}
                    onChange={handleEditFormChange}
                    placeholder="e.g. Programming, Design"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="durasi_menit" className="text-sm font-medium">
                    Durasi (menit) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="durasi_menit"
                    type="number"
                    value={getEditFormValue("durasi_menit")}
                    onChange={handleEditFormChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail" className="text-sm font-medium">
                  URL Thumbnail
                </Label>
                <Input
                  id="thumbnail"
                  value={getEditFormValue("thumbnail")}
                  onChange={handleEditFormChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level" className="text-sm font-medium">
                    Level <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={getEditFormValue("level")}
                    onValueChange={(value) =>
                      handleEditSelectChange("level", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Pemula</SelectItem>
                      <SelectItem value="intermediate">Menengah</SelectItem>
                      <SelectItem value="advanced">Lanjutan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={getEditFormValue("status")}
                    onValueChange={(value) =>
                      handleEditSelectChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={updateKursusMutation.isPending}>
                  {updateKursusMutation.isPending ? (
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

      {/* Modal Kelola Materi */}
      <Dialog open={isMateriModalOpen} onOpenChange={handleCloseMateriModal}>
        <DialogContent className="max-w-[60vw]!  w-full max-h-[90vh] overflow-hidden p-0">
          <DialogTitle className="sr-only">Materi Kursus</DialogTitle>
          <div className="p-6 overflow-y-auto max-h-[90vh]">
            {selectedKursusId && (
              <MateriContainer
                kursusId={selectedKursusId}
                onClose={handleCloseMateriModal}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
