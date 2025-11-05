import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // --- TAMBAHKAN OBJEK INI ---
  // Objek ini berfungsi untuk menimpa (override) atau menambahkan
  // aturan spesifik di atas konfigurasi Next.js.
  {
    rules: {
      // Ini akan mematikan error "@typescript-eslint/no-explicit-any"
      // di seluruh proyek Anda.
      "@typescript-eslint/no-explicit-any": "off",

      // Anda bisa menambahkan override aturan lain di sini jika perlu
      // "nama-aturan-lain": "off"
    },
  },
  // --------------------------

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
