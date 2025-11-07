"use client";

import React from "react";
import { useParams } from "next/navigation";
import { MentorDetailContainer } from "./container/MentorDetailContainer";

export default function MentorDetailPage() {
  const params = useParams();
  const mentorId = parseInt(params?.id as string);

  if (isNaN(mentorId)) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <p className="text-red-500 text-lg font-semibold">
          Error: Invalid Mentor ID in URL.
        </p>
      </div>
    );
  }

  return <MentorDetailContainer mentorId={mentorId} />;
}
