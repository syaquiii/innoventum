// src/proxy.ts (NAMA FILE BARU)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// NAMA FUNGSI BARU
export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl; // --- 1. Rute "Pengarah" (yang tidak boleh diakses jika sudah login) ---

  const redirectRoutes = ["/login", "/register", "/home"];

  if (token) {
    if (redirectRoutes.some((route) => pathname.startsWith(route))) {
      const url = token.role === "admin" ? "/admin/dashboard" : "/dasbor";
      return NextResponse.redirect(new URL(url, req.url));
    }
  } // --- 2. Rute yang harus diproteksi (tidak boleh diakses jika belum login) ---

  const protectedAdminRoutes = ["/admin"];
  const protectedMahasiswaRoutes = ["/dasbor", "/profil"];

  if (!token) {
    const isAccessingAdminRoute = protectedAdminRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isAccessingMahasiswaRoute = protectedMahasiswaRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAccessingAdminRoute || isAccessingMahasiswaRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  } // --- 3. Logika Otorisasi (jika sudah login dan akses rute terproteksi) ---

  if (protectedAdminRoutes.some((route) => pathname.startsWith(route))) {
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/dasbor", req.url));
    }
  }

  if (protectedMahasiswaRoutes.some((route) => pathname.startsWith(route))) {
    if (token.role !== "mahasiswa") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  } // 5. Jika lolos semua, lanjutkan

  return NextResponse.next();
}

// Config matcher (tetap sama)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
