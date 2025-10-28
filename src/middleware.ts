import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Dapatkan token dari request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // --- 1. Rute yang seharusnya tidak diakses jika sudah login ---
  const authRoutes = ["/login", "/register"];

  if (token) {
    if (authRoutes.some((route) => pathname.startsWith(route))) {
      // Jika sudah login dan mencoba akses /login atau /register,
      // redirect ke dashboard yang sesuai
      const url = token.role === "admin" ? "/admin/dashboard" : "/dasbor";
      return NextResponse.redirect(new URL(url, req.url));
    }
  }

  // --- 2. Rute yang harus diproteksi (tidak boleh diakses jika belum login) ---
  const protectedAdminRoutes = ["/admin"];
  const protectedMahasiswaRoutes = ["/dasbor", "/profil"];

  if (!token) {
    // --- LOGIKA DIPERBARUI ---
    // Cek apakah rute yang diakses adalah rute terproteksi
    const isAccessingAdminRoute = protectedAdminRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isAccessingMahasiswaRoute = protectedMahasiswaRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAccessingAdminRoute || isAccessingMahasiswaRoute) {
      // Jika *belum login* dan mencoba akses rute terproteksi,
      // baru redirect ke halaman login
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Jika *belum login* dan akses rute publik (spt '/', '/kelas', '/mentor'),
    // biarkan pengguna (mode explore).
    return NextResponse.next();
  }

  // --- 3. Logika Otorisasi (jika sudah login dan akses rute terproteksi) ---

  // Cek jika user mencoba mengakses halaman admin
  if (protectedAdminRoutes.some((route) => pathname.startsWith(route))) {
    // Jika rolenya BUKAN admin, tendang ke dasbor mahasiswa
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/dasbor", req.url));
    }
  }

  // Cek jika user mencoba mengakses dasbor mahasiswa
  if (protectedMahasiswaRoutes.some((route) => pathname.startsWith(route))) {
    // Jika rolenya BUKAN mahasiswa, tendang ke dasbor admin
    if (token.role !== "mahasiswa") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // 5. Jika lolos semua (termasuk user login akses rute publik), lanjutkan
  return NextResponse.next();
}

// Tentukan rute mana saja yang ingin diproses oleh middleware ini
export const config = {
  matcher: [
    /*
     * Cocokkan semua request kecuali untuk:
     * - /api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
