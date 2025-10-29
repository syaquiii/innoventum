"use client";

export default function HomePage() {
  return (
    <div
      className="font-poppins"
      style={{
        padding: "2rem 0",
        textAlign: "center",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "2.2rem",
          fontWeight: 700,
          marginBottom: "1.3rem",
        }}
      >
        Selamat Datang di Beranda!
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#555",
          marginBottom: "2rem",
        }}
      >
        Ini adalah halaman beranda untuk pengguna setelah login.
        <br />
        Silakan mulai menjelajahi fitur atau pilih menu di atas.
      </p>
    </div>
  );
}
