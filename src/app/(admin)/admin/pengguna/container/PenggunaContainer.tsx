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
import { Search, Edit, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useAdminUsers,
  useDeleteUser,
  useAdminUser,
  useUpdateUser,
  UserFilters,
  UpdateUserData,
} from "../hooks/useAdminPengguna";
import { Popup } from "@/shared/components/popup/NotificationPopup";

export default function AdminUsersPage() {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    search: "",
    role: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // State untuk notification popup
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  // State untuk modal edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEditId, setUserToEditId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<UpdateUserData>>({});

  const { data, isLoading, isError } = useAdminUsers(filters);
  const deleteMutation = useDeleteUser();
  const updateUserMutation = useUpdateUser();

  // Hook untuk mengambil data user yang akan diedit
  const { data: editingUserData, isLoading: isLoadingUser } =
    useAdminUser(userToEditId);

  const handleSearch = () => {
    setFilters({ ...filters, search: searchInput, page: 1 });
  };

  const handleRoleFilter = (value: string) => {
    setFilters({
      ...filters,
      role: value === "all" ? "" : (value as UserFilters["role"]),
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete, {
        onSuccess: () => {
          setUserToDelete(null);
          setNotification({
            message: "Pengguna berhasil dihapus",
            variant: "success",
          });
        },
        onError: (error: Error) => {
          setNotification({
            message: error.message || "Gagal menghapus pengguna",
            variant: "error",
          });
        },
      });
    }
  };

  const handleOpenEditModal = (userId: number) => {
    setUserToEditId(userId);
    setIsEditModalOpen(true);
    setEditFormData({}); // Reset form
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setUserToEditId(null);
    setEditFormData({});
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setEditFormData((prev) => {
      // Jika form masih kosong, mulai dari data awal
      if (Object.keys(prev).length === 0 && editingUserData) {
        const user = editingUserData.data;
        return {
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          nomor_telepon: user.nomor_telepon || "",
          role: user.role,
          nim: user.mahasiswa?.nim || "",
          institusi: user.mahasiswa?.institusi || "",
          program_studi: user.mahasiswa?.program_studi || "",
          nik: user.administrator?.nik || "",
          jabatan: user.administrator?.jabatan || "",
          level_akses: user.administrator?.level_akses || "",
          [id]: value,
        };
      }
      return { ...prev, [id]: value };
    });
  };

  const handleRoleChange = (value: string) => {
    setEditFormData((prev) => {
      // Jika form masih kosong, mulai dari data awal
      if (Object.keys(prev).length === 0 && editingUserData) {
        const user = editingUserData.data;
        return {
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          nomor_telepon: user.nomor_telepon || "",
          role: value as "mahasiswa" | "admin",
          nim: user.mahasiswa?.nim || "",
          institusi: user.mahasiswa?.institusi || "",
          program_studi: user.mahasiswa?.program_studi || "",
          nik: user.administrator?.nik || "",
          jabatan: user.administrator?.jabatan || "",
          level_akses: user.administrator?.level_akses || "",
        };
      }
      return {
        ...prev,
        role: value as "mahasiswa" | "admin",
      };
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEditId) return;

    // Gunakan editFormData, atau ambil dari editingUserData jika form belum diubah
    const formData =
      Object.keys(editFormData).length === 0 && editingUserData
        ? {
            nama_lengkap: editingUserData.data.nama_lengkap,
            email: editingUserData.data.email,
            nomor_telepon: editingUserData.data.nomor_telepon || "",
            role: editingUserData.data.role,
            nim: editingUserData.data.mahasiswa?.nim || "",
            institusi: editingUserData.data.mahasiswa?.institusi || "",
            program_studi: editingUserData.data.mahasiswa?.program_studi || "",
            nik: editingUserData.data.administrator?.nik || "",
            jabatan: editingUserData.data.administrator?.jabatan || "",
            level_akses: editingUserData.data.administrator?.level_akses || "",
          }
        : editFormData;

    // Membersihkan data kosong agar tidak menimpa jadi string kosong di DB
    const dataToUpdate: Partial<UpdateUserData> = {};
    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof UpdateUserData;
      if (formData[typedKey] !== "" && formData[typedKey] !== null) {
        if (typedKey === "role") {
          dataToUpdate[typedKey] = formData[typedKey] as "mahasiswa" | "admin";
        } else {
          dataToUpdate[typedKey] = formData[typedKey];
        }
      }
    });

    // Memastikan field yang required tetap ada
    dataToUpdate.nama_lengkap = formData.nama_lengkap;
    dataToUpdate.email = formData.email;
    dataToUpdate.role = formData.role;

    updateUserMutation.mutate(
      { userId: userToEditId, data: dataToUpdate },
      {
        onSuccess: () => {
          handleCloseEditModal();
          setNotification({
            message: "Data pengguna berhasil diperbarui",
            variant: "success",
          });
        },
        onError: (error: Error) => {
          setNotification({
            message: error.message || "Gagal memperbarui data pengguna",
            variant: "error",
          });
        },
      }
    );
  };

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return <Badge variant="destructive">Admin</Badge>;
    }
    if (role === "mahasiswa") {
      return <Badge variant="default">Mahasiswa</Badge>;
    }
    return <Badge variant="secondary">Lainnya</Badge>;
  };

  // Helper function untuk mendapatkan nilai form field
  const getFormValue = (field: keyof UpdateUserData): string => {
    if (editFormData[field] !== undefined) {
      return String(editFormData[field] || "");
    }
    if (editingUserData) {
      const user = editingUserData.data;
      switch (field) {
        case "nama_lengkap":
          return user.nama_lengkap || "";
        case "email":
          return user.email || "";
        case "nomor_telepon":
          return user.nomor_telepon || "";
        case "role":
          return user.role || "";
        case "nim":
          return user.mahasiswa?.nim || "";
        case "institusi":
          return user.mahasiswa?.institusi || "";
        case "program_studi":
          return user.mahasiswa?.program_studi || "";
        case "nik":
          return user.administrator?.nik || "";
        case "jabatan":
          return user.administrator?.jabatan || "";
        case "level_akses":
          return user.administrator?.level_akses || "";
        default:
          return "";
      }
    }
    return "";
  };

  // Helper untuk mendapatkan role saat ini
  const getCurrentRole = (): string => {
    if (editFormData.role) return editFormData.role;
    if (editingUserData) return editingUserData.data.role;
    return "";
  };

  if (isError) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-500">
          Gagal memuat data pengguna. Silakan coba lagi.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      {/* Popup Notification */}
      <Popup
        message={notification?.message}
        variant={notification?.variant}
        onClose={() => setNotification(null)}
        duration={5000}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
        <p className="text-muted-foreground mt-2">
          Kelola data pengguna mahasiswa dan administrator
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Cari nama atau email..."
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
          value={filters.role === "" ? "all" : filters.role}
          onValueChange={(value) => handleRoleFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Role</SelectItem>
            <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>Status</TableHead>
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
                  Tidak ada data pengguna
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell className="font-medium">{user.user_id}</TableCell>
                  <TableCell>{user.nama_lengkap}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.role === "mahasiswa" && user.mahasiswa ? (
                      <div className="text-sm">
                        <div className="font-medium">{user.mahasiswa.nim}</div>
                        <div className="text-muted-foreground">
                          {user.mahasiswa.institusi}
                        </div>
                      </div>
                    ) : user.role === "admin" && user.administrator ? (
                      <div className="text-sm">
                        <div className="font-medium">
                          {user.administrator.nik}
                        </div>
                        <div className="text-muted-foreground">
                          {user.administrator.jabatan}
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <Badge variant="outline" className="bg-green-50">
                        Terverifikasi
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50">
                        Belum Verifikasi
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEditModal(user.user_id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setUserToDelete(user.user_id)}
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
            dari {data.pagination.total} pengguna
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

      {/* Modal Edit Pengguna */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Pengguna
            </DialogTitle>
          </DialogHeader>
          {isLoadingUser ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-5 py-4">
              {/* Informasi Dasar */}
              <div className="space-y-4 pb-4 border-b">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                  Informasi Dasar
                </h3>

                {/* Nama */}
                <div className="space-y-2">
                  <Label htmlFor="nama_lengkap" className="text-sm font-medium">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nama_lengkap"
                    value={getFormValue("nama_lengkap")}
                    onChange={handleFormChange}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={getFormValue("email")}
                    onChange={handleFormChange}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                {/* No. Telepon */}
                <div className="space-y-2">
                  <Label
                    htmlFor="nomor_telepon"
                    className="text-sm font-medium"
                  >
                    No. Telepon
                  </Label>
                  <Input
                    id="nomor_telepon"
                    value={getFormValue("nomor_telepon")}
                    onChange={handleFormChange}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={getCurrentRole()}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Field Mahasiswa */}
              {getCurrentRole() === "mahasiswa" && (
                <div className="space-y-4 pb-4 border-b">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                    Informasi Mahasiswa
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="nim" className="text-sm font-medium">
                      NIM
                    </Label>
                    <Input
                      id="nim"
                      value={getFormValue("nim")}
                      onChange={handleFormChange}
                      placeholder="Nomor Induk Mahasiswa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institusi" className="text-sm font-medium">
                      Institusi
                    </Label>
                    <Input
                      id="institusi"
                      value={getFormValue("institusi")}
                      onChange={handleFormChange}
                      placeholder="Nama universitas/institusi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="program_studi"
                      className="text-sm font-medium"
                    >
                      Program Studi
                    </Label>
                    <Input
                      id="program_studi"
                      value={getFormValue("program_studi")}
                      onChange={handleFormChange}
                      placeholder="Jurusan/program studi"
                    />
                  </div>
                </div>
              )}

              {/* Field Admin */}
              {getCurrentRole() === "admin" && (
                <div className="space-y-4 pb-4 border-b">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                    Informasi Administrator
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="nik" className="text-sm font-medium">
                      NIK
                    </Label>
                    <Input
                      id="nik"
                      value={getFormValue("nik")}
                      onChange={handleFormChange}
                      placeholder="Nomor Induk Kependudukan"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jabatan" className="text-sm font-medium">
                      Jabatan
                    </Label>
                    <Input
                      id="jabatan"
                      value={getFormValue("jabatan")}
                      onChange={handleFormChange}
                      placeholder="Jabatan/posisi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="level_akses"
                      className="text-sm font-medium"
                    >
                      Level Akses
                    </Label>
                    <Input
                      id="level_akses"
                      value={getFormValue("level_akses")}
                      onChange={handleFormChange}
                      placeholder="Level akses sistem"
                    />
                  </div>
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending ? (
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={() => setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak
              dapat dibatalkan dan akan menghapus semua data terkait.
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
    </div>
  );
}
