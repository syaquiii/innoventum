import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
      }}
    >
      <main
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "2rem",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 24px 8px rgba(80,99,192,0.08)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
