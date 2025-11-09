"use client";

import { useState } from "react";
import ProfileSection from "../components/ProfileSection";
import ProfileForm from "../components/ProfileForm";
import { useProfile } from "../hooks/useProfile";
import { Popup } from "@/shared/components/popup/NotificationPopup";
import ProfileActivityStats from "../components/ProfileStats";
import ProfileActivityDetails from "../components/ProfileActivity";
import { ProfileFormData } from "@/app/api/profil/model/profile";

const ProfileLoadingSkeleton = () => (
  <div className="space-y-8">
    {/* Profile Card Skeleton */}
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

    {/* Stats Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-6 bg-white rounded-lg border shadow-sm animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-8 w-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Activity Details Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white rounded-lg border shadow-sm p-6 animate-pulse"
        >
          <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="p-4 bg-gray-50 rounded-lg">
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
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
    return (
      <div className="bg-dark min-h-screen py-44">
        <div className="mycontainer">
          <ProfileLoadingSkeleton />
        </div>
      </div>
    );
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

        {/* Profile Section */}
        <ProfileSection
          profile={profile}
          isLoading={isLoading}
          onEditClick={() => setIsEditing(true)}
        />

        {/* Profile Form */}
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

        {/* Activity Statistics */}
        {!isEditing && <ProfileActivityStats profile={profile} />}

        {/* Activity Details */}
        {!isEditing && <ProfileActivityDetails profile={profile} />}
      </div>
    </div>
  );
}
