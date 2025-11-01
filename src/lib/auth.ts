import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
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

        if (!user) {
          throw new Error("Email ini tidak terdaftar.");
        }

        if (user.password) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Password yang Anda masukkan salah.");
          }

          return {
            id: user.user_id.toString(),
            email: user.email,
            name: user.nama_lengkap,
            role: user.role,
            mahasiswaId: user.mahasiswa?.mahasiswa_id,
            adminId: user.administrator?.admin_id,
          };
        } else {
          throw new Error(
            "Akun ini terdaftar via Google. Silakan login pakai Google."
          );
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account, profile: _profile }) {
      console.log("🔐 SignIn attempt:", account?.provider, user.email);

      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.pengguna.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            console.log("Creating new user:", user.email);

            await prisma.pengguna.create({
              data: {
                email: user.email!,
                nama_lengkap: user.name || "",
                password: null,
                tanggal_lahir: null,
                nomor_telepon: null,
                role: Role.mahasiswa,
                emailVerified: new Date(),
                image: user.image,
              },
            });

            console.log("✅ User created successfully");
          } else {
            console.log("✅ User already exists, allowing signin");
          }

          // PERBAIKAN: Return true di sini kalau sukses
          return true;
        } catch (error) {
          console.error("❌ Error in signIn callback:", error);

          // PERBAIKAN: Double-check apakah user sebenarnya sudah ada
          try {
            const existingUser = await prisma.pengguna.findUnique({
              where: { email: user.email! },
            });

            if (existingUser) {
              console.log("⚠️ User exists despite error, allowing signin");
              return true;
            }
          } catch (checkError) {
            console.error("Failed to check user existence:", checkError);
          }

          // Hanya return false kalau benar-benar gagal
          console.error("🚫 Blocking signin due to critical error");
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account: _account }) {
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
