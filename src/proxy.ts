// src/proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // --- 1. Rute yang tidak boleh diakses jika sudah login ---
  const redirectRoutes = ["/login", "/register"];

  if (token) {
    // Redirect dari login/register
    if (redirectRoutes.some((route) => pathname.startsWith(route))) {
      const url = token.role === "admin" ? "/admin/dashboard" : "/home";
      return NextResponse.redirect(new URL(url, req.url));
    }

    // KHUSUS: Admin tidak boleh akses /home
    if (pathname.startsWith("/home") && token.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // --- 2. Rute yang harus diproteksi (tidak boleh diakses jika belum login) ---
  const protectedAdminRoutes = ["/admin"];
  const protectedMahasiswaRoutes = ["/profil"];

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
  }

  // --- 3. Logika Otorisasi ---
  if (protectedAdminRoutes.some((route) => pathname.startsWith(route))) {
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  if (protectedMahasiswaRoutes.some((route) => pathname.startsWith(route))) {
    if (token.role !== "mahasiswa") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
