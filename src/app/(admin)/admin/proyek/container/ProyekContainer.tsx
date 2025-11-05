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
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminProyek,
  useDeleteProyek,
  useAdminProyekDetail,
  useUpdateProyek,
  useCreateProyek,
  ProyekFilters,
  CreateProyekData,
  UpdateProyekData,
} from "../hooks/useProyek";
import { Popup } from "@/shared/components/popup/NotificationPopup";

export default function AdminProyekPage() {
  const [filters, setFilters] = useState<ProyekFilters>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    mahasiswa_id: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [proyekToDelete, setProyekToDelete] = useState<number | null>(null);

  // State untuk notification popup
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  // State untuk modal edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [proyekToEditId, setProyekToEditId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<UpdateProyekData>>(
    {}
  );

  // State untuk modal create
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateProyekData>({
    mahasiswa_id: 0,
    nama_proyek: "",
    deskripsi: "",
    status_proyek: "ideas",
    dokumen: "",
  });

  const { data, isLoading, isError } = useAdminProyek(filters);
  const deleteMutation = useDeleteProyek();
  const updateProyekMutation = useUpdateProyek();
  const createProyekMutation = useCreateProyek();

  // Hook untuk mengambil data proyek yang akan diedit
  const { data: editingProyekData, isLoading: isLoadingProyek } =
    useAdminProyekDetail(proyekToEditId);

  const handleSearch = () => {
    setFilters({ ...filters, search: searchInput, page: 1 });
  };

  const handleStatusFilter = (value: string) => {
    setFilters({
      ...filters,
      status: value === "all" ? "" : (value as ProyekFilters["status"]),
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  // Handler hapus
  const handleDelete = () => {
    if (proyekToDelete) {
      deleteMutation.mutate(proyekToDelete, {
        onSuccess: () => {
          setProyekToDelete(null);
          setNotification({
            message: "Proyek berhasil dihapus",
            variant: "success",
          });
        },
        onError: (error: Error) => {
          setNotification({
            message: error.message || "Gagal menghapus proyek",
            variant: "error",
          });
        },
      });
    }
  };

  const handleOpenEditModal = (proyekId: number) => {
    setProyekToEditId(proyekId);
    setIsEditModalOpen(true);
    setEditFormData({});
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setProyekToEditId(null);
    setEditFormData({});
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateFormData({
      mahasiswa_id: 0,
      nama_proyek: "",
      deskripsi: "",
      status_proyek: "ideas",
      dokumen: "",
    });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({
      mahasiswa_id: 0,
      nama_proyek: "",
      deskripsi: "",
      status_proyek: "ideas",
      dokumen: "",
    });
  };

  // Handler untuk perubahan form edit
  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setEditFormData((prev) => {
      if (Object.keys(prev).length === 0 && editingProyekData) {
        const proyek = editingProyekData.data;
        return {
          mahasiswa_id: proyek.mahasiswa_id,
          nama_proyek: proyek.nama_proyek,
          deskripsi: proyek.deskripsi || "",
          status_proyek: proyek.status_proyek as any,
          dokumen: proyek.dokumen || "",
          [id]: id === "mahasiswa_id" ? parseInt(value) || 0 : value,
        };
      }
      return {
        ...prev,
        [id]: id === "mahasiswa_id" ? parseInt(value) || 0 : value,
      };
    });
  };

  // Handler select untuk edit form
  const handleEditSelectChange = (field: string, value: string) => {
    setEditFormData((prev) => {
      if (Object.keys(prev).length === 0 && editingProyekData) {
        const proyek = editingProyekData.data;
        return {
          mahasiswa_id: proyek.mahasiswa_id,
          nama_proyek: proyek.nama_proyek,
          deskripsi: proyek.deskripsi || "",
          status_proyek: proyek.status_proyek as any,
          dokumen: proyek.dokumen || "",
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
      [id]: id === "mahasiswa_id" ? parseInt(value) || 0 : value,
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
    if (!proyekToEditId) return;

    const formData =
      Object.keys(editFormData).length === 0 && editingProyekData
        ? {
            mahasiswa_id: editingProyekData.data.mahasiswa_id,
            nama_proyek: editingProyekData.data.nama_proyek,
            deskripsi: editingProyekData.data.deskripsi || "",
            status_proyek: editingProyekData.data.status_proyek as any,
            dokumen: editingProyekData.data.dokumen || "",
          }
        : editFormData;

    const dataToUpdate: Partial<UpdateProyekData> = {};
    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof UpdateProyekData;
      if (formData[typedKey] !== "" && formData[typedKey] !== null) {
        dataToUpdate[typedKey] = formData[typedKey] as any;
      }
    });

    updateProyekMutation.mutate(
      { proyekId: proyekToEditId, data: dataToUpdate },
      {
        onSuccess: () => {
          handleCloseEditModal();
          setNotification({
            message: "Proyek berhasil diperbarui",
            variant: "success",
          });
        },
        onError: (error: Error) => {
          setNotification({
            message: error.message || "Gagal memperbarui proyek",
            variant: "error",
          });
        },
      }
    );
  };

  // Handler submit create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (createFormData.mahasiswa_id === 0) {
      setNotification({
        message: "ID Mahasiswa wajib diisi",
        variant: "error",
      });
      return;
    }

    createProyekMutation.mutate(createFormData, {
      onSuccess: () => {
        handleCloseCreateModal();
        setNotification({
          message: "Proyek berhasil ditambahkan",
          variant: "success",
        });
      },
      onError: (error: Error) => {
        setNotification({
          message: error.message || "Gagal menambahkan proyek",
          variant: "error",
        });
      },
    });
  };

  // Helper badge status proyek
  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: string; label: string }> = {
      ideas: { variant: "secondary", label: "Ideas" },
      perencanaan: { variant: "default", label: "Perencanaan" },
      eksekusi: { variant: "outline", label: "Eksekusi" },
      selesai: { variant: "default", label: "Selesai" },
    };
    const item = config[status] || { variant: "secondary", label: status };
    return <Badge variant={item.variant as any}>{item.label}</Badge>;
  };

  // Helper untuk mengambil nilai field edit form
  const getEditFormValue = (field: keyof UpdateProyekData): any => {
    if (editFormData[field] !== undefined) {
      return editFormData[field];
    }
    if (editingProyekData) {
      const proyek = editingProyekData.data;
      return proyek[field as keyof typeof proyek] || "";
    }
    return "";
  };

  if (isError) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-500">
          Gagal memuat data proyek. Silakan coba lagi.
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
          <h1 className="text-3xl font-bold">Manajemen Proyek Bisnis</h1>
          <p className="text-muted-foreground mt-2">
            Kelola proyek bisnis mahasiswa
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Cari nama proyek atau deskripsi..."
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
          value={filters.status === "" ? "all" : filters.status}
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="ideas">Ideas</SelectItem>
            <SelectItem value="perencanaan">Perencanaan</SelectItem>
            <SelectItem value="eksekusi">Eksekusi</SelectItem>
            <SelectItem value="selesai">Selesai</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nama Proyek</TableHead>
              <TableHead>Mahasiswa</TableHead>
              <TableHead>NIM</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dokumen</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Tidak ada data proyek
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((proyek) => (
                <TableRow key={proyek.proyek_id}>
                  <TableCell className="font-medium">
                    {proyek.proyek_id}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium truncate">
                        {proyek.nama_proyek}
                      </div>
                      {proyek.deskripsi && (
                        <div className="text-sm text-muted-foreground truncate">
                          {proyek.deskripsi}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {proyek.mahasiswa.pengguna.nama_lengkap}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {proyek.mahasiswa.program_studi}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{proyek.mahasiswa.nim}</TableCell>
                  <TableCell>{getStatusBadge(proyek.status_proyek)}</TableCell>
                  <TableCell>
                    {proyek.dokumen ? (
                      <a
                        href={proyek.dokumen}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Tidak ada
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEditModal(proyek.proyek_id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setProyekToDelete(proyek.proyek_id)}
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
            dari {data.pagination.total} proyek
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
        open={!!proyekToDelete}
        onOpenChange={() => setProyekToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak
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

      {/* Modal Create Proyek */}
      <Dialog open={isCreateModalOpen} onOpenChange={handleCloseCreateModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Tambah Proyek Baru
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="mahasiswa_id" className="text-sm font-medium">
                ID Mahasiswa <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mahasiswa_id"
                type="number"
                value={createFormData.mahasiswa_id || ""}
                onChange={handleCreateFormChange}
                placeholder="Masukkan ID mahasiswa"
                required
              />
              <p className="text-xs text-muted-foreground">
                ID mahasiswa dapat dilihat di halaman manajemen mahasiswa
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama_proyek" className="text-sm font-medium">
                Nama Proyek <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama_proyek"
                value={createFormData.nama_proyek}
                onChange={handleCreateFormChange}
                placeholder="Masukkan nama proyek"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi" className="text-sm font-medium">
                Deskripsi
              </Label>
              <Textarea
                id="deskripsi"
                value={createFormData.deskripsi}
                onChange={handleCreateFormChange}
                placeholder="Masukkan deskripsi proyek"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status_proyek" className="text-sm font-medium">
                Status Proyek <span className="text-red-500">*</span>
              </Label>
              <Select
                value={createFormData.status_proyek}
                onValueChange={(value) =>
                  handleCreateSelectChange("status_proyek", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ideas">Ideas</SelectItem>
                  <SelectItem value="perencanaan">Perencanaan</SelectItem>
                  <SelectItem value="eksekusi">Eksekusi</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dokumen" className="text-sm font-medium">
                URL Dokumen
              </Label>
              <Input
                id="dokumen"
                value={createFormData.dokumen}
                onChange={handleCreateFormChange}
                placeholder="https://example.com/document.pdf"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" disabled={createProyekMutation.isPending}>
                {createProyekMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Tambah Proyek"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Proyek */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Proyek
            </DialogTitle>
          </DialogHeader>
          {isLoadingProyek ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="mahasiswa_id" className="text-sm font-medium">
                  ID Mahasiswa <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mahasiswa_id"
                  type="number"
                  value={getEditFormValue("mahasiswa_id")}
                  onChange={handleEditFormChange}
                  placeholder="Masukkan ID mahasiswa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nama_proyek" className="text-sm font-medium">
                  Nama Proyek <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nama_proyek"
                  value={getEditFormValue("nama_proyek")}
                  onChange={handleEditFormChange}
                  placeholder="Masukkan nama proyek"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi" className="text-sm font-medium">
                  Deskripsi
                </Label>
                <Textarea
                  id="deskripsi"
                  value={getEditFormValue("deskripsi")}
                  onChange={handleEditFormChange}
                  placeholder="Masukkan deskripsi proyek"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status_proyek" className="text-sm font-medium">
                  Status Proyek <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={getEditFormValue("status_proyek")}
                  onValueChange={(value) =>
                    handleEditSelectChange("status_proyek", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ideas">Ideas</SelectItem>
                    <SelectItem value="perencanaan">Perencanaan</SelectItem>
                    <SelectItem value="eksekusi">Eksekusi</SelectItem>
                    <SelectItem value="selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dokumen" className="text-sm font-medium">
                  URL Dokumen
                </Label>
                <Input
                  id="dokumen"
                  value={getEditFormValue("dokumen")}
                  onChange={handleEditFormChange}
                  placeholder="https://example.com/document.pdf"
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={updateProyekMutation.isPending}>
                  {updateProyekMutation.isPending ? (
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
