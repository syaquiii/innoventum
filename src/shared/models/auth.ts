import { Role } from "@prisma/client";
import { DefaultSession, User as DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    mahasiswaId?: number | null;
    adminId?: number | null;
  }

  interface Session {
    user?: {
      id: string;
      role: Role;
      mahasiswaId?: number | null;
      adminId?: number | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    mahasiswaId?: number | null;
    adminId?: number | null;
  }
}
