"use client";
import { useState, type ReactNode } from "react";
import {
  Home,
  Users,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Briefcase,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface AdminSidebarLayoutProps {
  children: ReactNode;
}

export default function AdminSidebarLayout({
  children,
}: AdminSidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" }); // Arahkan ke /login setelah logout
  };
  const menuItems = [
    // ... (menuItems Anda tetap sama, tidak perlu diubah)
    { icon: Home, label: "Dashboard", href: "/admin", hasSubmenu: false },
    {
      icon: Users,
      label: "Pengguna",
      href: "/admin/pengguna",
      hasSubmenu: true,
      submenu: [
        { label: "Semua Pengguna", href: "/admin/pengguna" },
        { label: "Mahasiswa", href: "/admin/mahasiswa" },
        { label: "Administrator", href: "/admin/administrator" },
      ],
    },
    {
      icon: BookOpen,
      label: "Kursus",
      href: "/admin/kursus",
      hasSubmenu: true,
      submenu: [
        { label: "Semua Kursus", href: "/admin/kursus" },
        { label: "Tambah Kursus", href: "/admin/kursus/tambah" },
        { label: "Materi", href: "/admin/materi" },
        { label: "Enrollment", href: "/admin/enrollment" },
      ],
    },
    {
      icon: GraduationCap,
      label: "Mentor",
      href: "/admin/mentor",
      hasSubmenu: false,
    },
    {
      icon: MessageSquare,
      label: "Forum",
      href: "/admin/forum",
      hasSubmenu: true,
      submenu: [
        { label: "Thread", href: "/admin/forum/thread" },
        { label: "Komentar", href: "/admin/forum/komentar" },
      ],
    },
    {
      icon: Briefcase,
      label: "Proyek Bisnis",
      href: "/admin/proyek",
      hasSubmenu: false,
    },
    {
      icon: BarChart3,
      label: "Laporan",
      href: "/admin/laporan",
      hasSubmenu: false,
    },
    {
      icon: Settings,
      label: "Pengaturan",
      href: "/admin/pengaturan",
      hasSubmenu: false,
    },
  ];

  const toggleSubmenu = (label: string) => {
    if (isCollapsed) return;
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-dark transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ourgreen rounded-lg flex items-center justify-center">
                  <span className="text-dark font-bold text-xl">I</span>
                </div>
                <span className="text-white font-semibold text-lg">
                  Innoventum
                </span>
              </div>
            )}
            {isCollapsed && (
              <div className="w-full flex justify-center">
                <div className="w-10 h-10 bg-ourgreen rounded-lg flex items-center justify-center">
                  <span className="text-dark font-bold text-xl">I</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <div>
                    <a
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-dark-hover rounded-lg transition-all group ${
                        isCollapsed ? "justify-center" : ""
                      }`}
                      onClick={(e) => {
                        if (item.hasSubmenu && !isCollapsed) {
                          e.preventDefault();
                          toggleSubmenu(item.label);
                        }
                      }}
                      title={isCollapsed ? item.label : ""}
                    >
                      <item.icon size={20} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-sm font-medium">
                            {item.label}
                          </span>
                          {item.hasSubmenu &&
                            (expandedMenu === item.label ? (
                              <ChevronDown
                                size={16}
                                className="transition-transform"
                              />
                            ) : (
                              <ChevronRight
                                size={16}
                                className="transition-transform"
                              />
                            ))}
                        </>
                      )}
                    </a>

                    {/* Submenu */}
                    {item.hasSubmenu &&
                      !isCollapsed &&
                      expandedMenu === item.label && (
                        <ul className="mt-2 ml-9 space-y-1">
                          {item.submenu?.map((subitem) => (
                            <li key={subitem.label}>
                              <a
                                href={subitem.href}
                                className="block px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-dark-hover/50 rounded-lg transition-all"
                              >
                                {subitem.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* === TOMBOL COLLAPSE LAMA DIHAPUS DARI SINI === */}
          <div className="border-t border-white/10 p-3">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-red-600/30 rounded-lg transition-all group ${
                isCollapsed ? "justify-center" : ""
              }`}
              title="Logout"
            >
              <LogOut size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="flex text-sm font-medium">Logout</span>
              )}
            </button>
          </div>
          {/* User Profile Section */}
          <div className="border-t border-white/10 p-4">
            <div
              className={`flex items-center gap-3 ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <div className="w-10 h-10 bg-ourgreen rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-dark font-semibold text-sm">AD</span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    Admin
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    Administrator
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* === TOMBOL FLOATING BARU DITAMBAHKAN DI SINI === */}
      <button
        onClick={() => {
          setIsCollapsed(!isCollapsed);
          if (!isCollapsed) setExpandedMenu(null);
        }}
        className={`fixed top-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-normal text-white shadow-2xl transition-all duration-300 hover:bg-dark-hover transform -translate-y-1/2 ${
          isCollapsed
            ? "left-20 -translate-x-1/2" // w-20 = 5rem
            : "left-64 -translate-x-1/2" // w-64 = 16rem
        }`}
        title={isCollapsed ? "Expand" : "Collapse"}
      >
        <ChevronRight
          size={20}
          className={`transition-transform duration-300 ${
            isCollapsed ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>

      {/* Main Content Area */}
      <main
        className={`${
          isCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-300 min-h-screen`}
      >
        {children}
      </main>
    </div>
  );
}
