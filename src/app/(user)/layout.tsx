import Navbar from "@/shared/components/navbar/Navbar";
import React from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="">{children}</main>
    </>
  );
}
