import { Role } from "@prisma/client";
import { DefaultSession, User as DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Tipe 'User' ini adalah apa yang dikembalikan oleh
   * callback `authorize` atau profil provider (spt Google).
   */
  interface User {
    id: string;
    role: Role;
    mahasiswaId?: number | null;
    adminId?: number | null;
  }

  /**
   * Tipe 'Session' ini adalah apa yang dikembalikan oleh
   * `useSession()` atau `getSession()`.
   */
  interface Session {
    user?: {
      id: string;
      role: Role;
      mahasiswaId?: number | null;
      adminId?: number | null;
    } & DefaultSession["user"]; // <-- Menggabungkan properti default (name, email, image)
  }
}

declare module "next-auth/jwt" {
  /**
   * Tipe 'JWT' ini adalah apa yang ada di dalam
   * token JWT (parameter `token` di callbacks).
   */
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
    mahasiswaId?: number | null;
    adminId?: number | null;
  }
}
