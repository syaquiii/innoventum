import { useAuth } from "@/shared/hooks/useAuth";
import React from "react";

const ProfileContainer = () => {
  const { profile } = useAuth();
  return (
    <main className="bg-dark min-h-screen py-32 text-light">
      <section className="mycontainer">a</section>
    </main>
  );
};

export default ProfileContainer;
