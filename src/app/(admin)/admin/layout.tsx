import AdminSidebarLayout from "@/shared/components/admin/sidebar/Sidebar";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminSidebarLayout>{children}</AdminSidebarLayout>;
}
