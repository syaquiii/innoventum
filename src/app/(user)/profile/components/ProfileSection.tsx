"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { ProfileSectionProps } from "../models/types";
import { useAuth } from "@/shared/hooks/useAuth";

const ProfileSection = ({
  profile,
  isLoading,
  onEditClick,
}: ProfileSectionProps) => {
  const { session } = useAuth();
  const getInitials = () => {
    if (profile?.nama_lengkap) {
      return profile.nama_lengkap
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (profile?.email) {
      return profile.email[0].toUpperCase();
    }
    return "U";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="p-4 rounded-lg border bg-white shadow-sm">
        <p className="text-red-500">Gagal memuat profil.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-8 font-poppins  ">
      {session?.user?.image ? (
        <img
          src={session?.user?.image}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover bg-light border shadow-sm shrink-0"
        />
      ) : (
        <div className="w-24 h-24 text-dark bg-light rounded-full flex items-center justify-center font-bold text-2xl shrink-0">
          {getInitials()}
        </div>
      )}
      <div className="flex-1 text-light">
        <span className="text-3xl font-semibold">
          {profile.nama_lengkap || profile.email}
        </span>
        <div className="grid grid-cols-2 gap-4 mt-4 max-w-sm">
          <Button variant="normal" onClick={onEditClick}>
            Edit Profil
          </Button>
          <Button
            variant="destructive"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Keluar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
