// file: app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleGoogleSignIn = () => {
    // Ini akan mengarahkan pengguna ke halaman login Google
    // dan mengembalikan mereka ke '/dasbor' setelah berhasil
    signIn("google", { callbackUrl: "/dasbor" });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Ini memanggil 'authorize' function di [...nextauth]/route.ts
    const result = await signIn("credentials", {
      redirect: false, // Kita tangani redirect manual
      email: email,
      password: password,
    });

    if (result?.error) {
      // Menampilkan pesan error dari 'authorize' (misal: "Email atau password salah")
      // Ini sesuai Alternative Flow-1 di UC-IN-02 [cite: 58]
      setError(result.error);
    } else if (result?.ok) {
      // Sukses, arahkan ke dasbor
      // Ini sesuai Main Flow 5 di UC-IN-02 [cite: 58]
      router.push("/dasbor");
    }
  };

  // UI ini didasarkan pada Sketsa UI-001 [cite: 1258, 1261]
  return (
    <div>
      <h1>Masuk [cite: 1261]</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email [cite: 1263]</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Kata Sandi [cite: 1265]</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Masuk [cite: 1259]</button>
      </form>
      <button onClick={handleGoogleSignIn}>Masuk dengan Google</button>
    </div>
  );
}
