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
  MessageSquare,
  Eye,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useForum,
  useDeleteThread,
  useThreadDetail,
  useUpdateThread,
  useCreateThread,
  ThreadFilters,
  CreateThreadData,
  UpdateThreadData,
} from "../hooks/useForum";
import { Popup } from "@/shared/components/popup/NotificationPopup";
import ThreadDetailModal from "../components/Modal";

export default function ForumContainer() {
  const [filters, setFilters] = useState<ThreadFilters>({
    page: 1,
    limit: 10,
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [threadToDelete, setThreadToDelete] = useState<number | null>(null);

  // State untuk notification popup
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  // State untuk modal edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [threadToEditId, setThreadToEditId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<UpdateThreadData>>(
    {}
  );

  // State untuk modal create
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateThreadData>({
    judul: "",
    isi: "",
  });

  // State untuk modal detail
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);

  const { data, isLoading, isError } = useForum(filters);
  const deleteMutation = useDeleteThread();
  const updateThreadMutation = useUpdateThread();
  const createThreadMutation = useCreateThread();

  // Hook untuk mengambil data thread yang akan diedit
  const { data: editingThreadData, isLoading: isLoadingThread } =
    useThreadDetail(threadToEditId);

  const handleSearch = () => {
    setFilters({ ...filters, search: searchInput, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  // Handler hapus
  const handleDelete = () => {
    if (threadToDelete) {
      deleteMutation.mutate(threadToDelete, {
        onSuccess: () => {
          setThreadToDelete(null);
          setNotification({
            message: "Thread berhasil dihapus",
            variant: "success",
          });
        },
        onError: (error: Error) => {
          setNotification({
            message: error.message || "Gagal menghapus thread",
            variant: "error",
          });
        },
      });
    }
  };

  const handleOpenEditModal = (threadId: number) => {
    setThreadToEditId(threadId);
    setIsEditModalOpen(true);
    setEditFormData({});
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setThreadToEditId(null);
    setEditFormData({});
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateFormData({
      judul: "",
      isi: "",
    });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({
      judul: "",
      isi: "",
    });
  };

  // Handler untuk modal detail
  const handleOpenDetailModal = (threadId: number) => {
    setSelectedThreadId(threadId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedThreadId(null);
  };

  // Handler untuk perubahan form edit
  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setEditFormData((prev) => {
      if (Object.keys(prev).length === 0 && editingThreadData) {
        const thread = editingThreadData.data;
        return {
          judul: thread.judul,
          isi: thread.isi,
          [id]: value,
        };
      }
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  // Handler perubahan form create
  const handleCreateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handler submit edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadToEditId) return;

    const formData =
      Object.keys(editFormData).length === 0 && editingThreadData
        ? {
            judul: editingThreadData.data.judul,
            isi: editingThreadData.data.isi,
          }
        : editFormData;

    const dataToUpdate: Partial<UpdateThreadData> = {};
    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof UpdateThreadData;
      if (formData[typedKey] !== "" && formData[typedKey] !== null) {
        dataToUpdate[typedKey] = formData[typedKey] as any;
      }
    });

    updateThreadMutation.mutate(
      { threadId: threadToEditId, data: dataToUpdate },
      {
        onSuccess: () => {
          handleCloseEditModal();
          setNotification({
            message: "Thread berhasil diperbarui",
            variant: "success",
          });
        },
        onError: (error: Error) => {
          setNotification({
            message: error.message || "Gagal memperbarui thread",
            variant: "error",
          });
        },
      }
    );
  };

  // Handler submit create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createThreadMutation.mutate(createFormData, {
      onSuccess: () => {
        handleCloseCreateModal();
        setNotification({
          message: "Thread berhasil ditambahkan",
          variant: "success",
        });
      },
      onError: (error: Error) => {
        setNotification({
          message: error.message || "Gagal menambahkan thread",
          variant: "error",
        });
      },
    });
  };

  // Helper untuk mengambil nilai field edit form
  const getEditFormValue = (field: keyof UpdateThreadData): any => {
    if (editFormData[field] !== undefined) {
      return editFormData[field];
    }
    if (editingThreadData) {
      const thread = editingThreadData.data;
      return thread[field as keyof typeof thread] || "";
    }
    return "";
  };

  if (isError) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-500">
          Gagal memuat data forum. Silakan coba lagi.
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
          <h1 className="text-3xl font-bold">Forum Diskusi</h1>
          <p className="text-muted-foreground mt-2">
            Diskusi dan berbagi pengetahuan dengan mahasiswa lainnya
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Cari judul atau isi thread..."
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
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Pembuat</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Komentar</TableHead>
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
                  Tidak ada data thread
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((thread) => (
                <TableRow
                  key={thread.thread_id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleOpenDetailModal(thread.thread_id)}
                >
                  <TableCell className="font-medium">
                    {thread.thread_id}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <div className="font-medium truncate">{thread.judul}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {thread.isi.substring(0, 100)}
                        {thread.isi.length > 100 && "..."}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {thread.mahasiswa.pengguna.nama_lengkap}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{thread.jumlah_views}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{thread.jumlah_komentar}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div
                      className="flex justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(thread.thread_id);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setThreadToDelete(thread.thread_id);
                        }}
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
      {data && data.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Menampilkan {(filters.page! - 1) * filters.limit! + 1}
            {" - "}
            {Math.min(
              filters.page! * filters.limit!,
              data.pagination?.total ?? 0
            )}{" "}
            dari {data.pagination?.total ?? 0} thread
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
            {(data.pagination?.totalPages
              ? Array.from(
                  { length: data.pagination.totalPages },
                  (_, i) => i + 1
                )
              : []
            )
              .filter((page) => {
                const currentPage = filters.page!;
                return (
                  page === 1 ||
                  page === (data.pagination?.totalPages ?? 1) ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, index, array) => (
                <>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2">...</span>
                  )}
                  <Button
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
              disabled={filters.page === (data.pagination?.totalPages ?? 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!threadToDelete}
        onOpenChange={() => setThreadToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus thread ini? Tindakan ini tidak
              dapat dibatalkan dan akan menghapus semua komentar terkait.
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

      {/* Modal Create Thread */}
      <Dialog open={isCreateModalOpen} onOpenChange={handleCloseCreateModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Buat Thread Baru
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="judul" className="text-sm font-medium">
                Judul Thread <span className="text-red-500">*</span>
              </Label>
              <Input
                id="judul"
                value={createFormData.judul}
                onChange={handleCreateFormChange}
                placeholder="Masukkan judul thread"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isi" className="text-sm font-medium">
                Isi Thread <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="isi"
                value={createFormData.isi}
                onChange={handleCreateFormChange}
                placeholder="Masukkan isi thread"
                rows={6}
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" disabled={createThreadMutation.isPending}>
                {createThreadMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Buat Thread"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Thread */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Thread
            </DialogTitle>
          </DialogHeader>
          {isLoadingThread ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="judul" className="text-sm font-medium">
                  Judul Thread <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="judul"
                  value={getEditFormValue("judul")}
                  onChange={handleEditFormChange}
                  placeholder="Masukkan judul thread"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isi" className="text-sm font-medium">
                  Isi Thread <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="isi"
                  value={getEditFormValue("isi")}
                  onChange={handleEditFormChange}
                  placeholder="Masukkan isi thread"
                  rows={6}
                  required
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={updateThreadMutation.isPending}>
                  {updateThreadMutation.isPending ? (
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

      {/* Modal Detail Thread */}
      <ThreadDetailModal
        threadId={selectedThreadId}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onNotification={setNotification}
      />
    </div>
  );
}
