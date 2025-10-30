"use client";

import { Button } from "@/components/ui/button";
import { navList } from "./data/navlist";
import { useEffect, useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll ke bawah & lebih dari 100px
        setIsVisible(false);
      } else {
        // Scroll ke atas
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`mycontainer fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-light px-20 text-xl font-semibold font-poppins py-6 my-6 rounded-2xl shadow-xl">
        <ul className="flex justify-between items-center">
          <div className="transition-transform hover:scale-110 duration-200 cursor-pointer">
            Ini Logo
          </div>
          {navList.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="relative inline-block transition-all duration-300 hover:text-normal hover:scale-105 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-normal after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <Button
            variant="normal"
            className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-normal hover:text-white"
          >
            Login
          </Button>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
