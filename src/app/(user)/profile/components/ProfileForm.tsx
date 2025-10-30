"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ProfileFormData, ProfileFormProps } from "../models/types";
import { profileSchema } from "@/app/api/profil/zod/profile";

export default function ProfileForm({
  profile,
  onCancel,
  onSave,
  isSaving,
}: ProfileFormProps) {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nama_lengkap: profile?.nama_lengkap || "",
      tanggal_lahir: profile?.tanggal_lahir
        ? format(new Date(profile.tanggal_lahir), "yyyy-MM-dd")
        : "",
      nomor_telepon: profile?.nomor_telepon || "",
      mahasiswa: {
        nim: profile?.mahasiswa?.nim || "",
        institusi: profile?.mahasiswa?.institusi || "",
        program_studi: profile?.mahasiswa?.program_studi || "",
      },
    },
  });

  function onSubmit(data: ProfileFormData) {
    onSave(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 text-light"
      >
        <h2 className="text-2xl font-semibold text-light">Edit Profil</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="nama_lengkap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama lengkap Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggal_lahir"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value as string | undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nomor_telepon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="0812..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="mahasiswa.nim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIM</FormLabel>
                  <FormControl>
                    <Input placeholder="NIM Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mahasiswa.institusi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institusi / Universitas</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama universitas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mahasiswa.program_studi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Studi</FormLabel>
                  <FormControl>
                    <Input placeholder="Program studi Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="destructive" onClick={onCancel}>
            Batal
          </Button>
          <Button variant="normal" type="submit" disabled={isSaving}>
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
