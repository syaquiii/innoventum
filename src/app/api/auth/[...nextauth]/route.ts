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

        // 1. Cek dulu apakah email-nya ada
        if (!user) {
          throw new Error("Email ini tidak terdaftar.");
        }

        // 2. PERBAIKAN: Cek jika user punya password (dibuat via credentials)
        if (user.password) {
          // 3. Jika ada password, baru bandingkan
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password // Sekarang aman, ini pasti string
          );

          if (!isPasswordValid) {
            throw new Error("Password yang Anda masukkan salah.");
          }

          // 4. Jika lolos, return user
          return {
            id: user.user_id.toString(),
            email: user.email,
            name: user.nama_lengkap,
            role: user.role,
            mahasiswaId: user.mahasiswa?.mahasiswa_id,
            adminId: user.administrator?.admin_id,
          };
        } else {
          // 5. Jika user ada tapi password-nya null (dibuat via Google)
          throw new Error(
            "Akun ini terdaftar via Google. Silakan login pakai Google."
          );
        }
      },
    }),
  ],

  session: {
    strategy: "jwt", // Pakai JWT, bukan database session
  },

  callbacks: {
    async signIn({ user, account, profile: _profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.pengguna.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            await prisma.pengguna.create({
              data: {
                email: user.email!,
                nama_lengkap: user.name || "",
                password: null, // Google tidak punya password
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
    error: "/login", // Jika error (misal password salah), kembali ke /login
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
