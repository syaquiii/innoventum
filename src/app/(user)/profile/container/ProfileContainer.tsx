"use client";

import { useState } from "react";
import { ProfileFormData } from "../models/types";
import ProfileSection from "../components/ProfileSection";
import ProfileForm from "../components/ProfileForm";
import { useProfile } from "../hooks/useProfile";
import { Popup } from "@/shared/components/popup/NotificationPopup";

const ProfileLoadingSkeleton = () => (
  <div className="p-4 rounded-lg border bg-white shadow-sm animate-pulse">
    <div className="flex gap-8 font-poppins">
      <div className="w-24 h-24 bg-gray-200 rounded-full" />
      <div className="flex-1">
        <div className="h-9 w-1/2 bg-gray-200 rounded-md mb-4" />
        <div className="flex gap-4 mt-4">
          <div className="h-10 w-32 bg-gray-200 rounded-md" />
          <div className="h-10 w-32 bg-gray-200 rounded-md" />
        </div>
      </div>
    </div>
  </div>
);

export default function ProfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [popupVariant, setPopupVariant] = useState<"success" | "error">(
    "success"
  );

  const { profile, isLoading, updateProfile, isSaving } = useProfile();

  const handleSave = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => {
        setIsEditing(false);
        setPopupVariant("success");
        setPopupMessage("Profil berhasil diperbarui!");
      },
      onError: (error) => {
        setPopupVariant("error");
        setPopupMessage(error.message || "Gagal memperbarui profil");
      },
    });
  };

  if (isLoading) {
    return <ProfileLoadingSkeleton />;
  }

  return (
    <div className="bg-dark min-h-screen py-44">
      <div className="mycontainer">
        <Popup
          message={popupMessage}
          variant={popupVariant}
          duration={5000}
          onClose={() => setPopupMessage("")}
        />

        <ProfileSection
          profile={profile}
          isLoading={isLoading}
          onEditClick={() => setIsEditing(true)}
        />

        {/* ProfileForm */}
        {isEditing && (
          <div className="mt-8">
            <ProfileForm
              profile={profile}
              onCancel={() => setIsEditing(false)}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </div>
        )}
      </div>
    </div>
  );
}
