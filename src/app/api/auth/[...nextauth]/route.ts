import NextAuth, { NextAuthOptions } from "next-auth";
// HAPUS baris ini: import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  // HAPUS baris ini: adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password harus diisi");
        }

        const user = await prisma.pengguna.findUnique({
          where: { email: credentials.email },
          include: {
            mahasiswa: true,
            administrator: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Email atau password salah");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Email atau password salah");
        }

        // Tipe kembalian ini sekarang cocok dengan 'User'
        // yang kita definisikan di next-auth.d.ts
        return {
          id: user.user_id.toString(),
          email: user.email,
          name: user.nama_lengkap,
          role: user.role,
          mahasiswaId: user.mahasiswa?.mahasiswa_id,
          adminId: user.administrator?.admin_id,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt", // Pakai JWT, bukan database session
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.pengguna.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // PERBAIKAN BUG:
            // Pastikan schema.prisma Anda mengizinkan password,
            // tanggal_lahir, dan nomor_telepon menjadi opsional (null)
            await prisma.pengguna.create({
              data: {
                email: user.email!,
                nama_lengkap: user.name || "",
                password: null, // Jangan "" (string kosong), tapi null
                tanggal_lahir: null, // Google tidak menyediakan ini
                nomor_telepon: null, // Google tidak menyediakan ini
                role: Role.mahasiswa,
                emailVerified: new Date(),
                image: user.image,
              },
            });
          }
        } catch (error) {
          console.error("Error creating user:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        const dbUser = await prisma.pengguna.findUnique({
          where: { email: user.email! },
          include: {
            mahasiswa: true,
            administrator: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.user_id.toString();
          token.role = dbUser.role;
          token.mahasiswaId = dbUser.mahasiswa?.mahasiswa_id;
          token.adminId = dbUser.administrator?.admin_id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.mahasiswaId = token.mahasiswaId;
        session.user.adminId = token.adminId;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
