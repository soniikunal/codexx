// src/components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white shadow transition-transform duration-300 text-black ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">MySite</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6">
          <li className="relative group">
            <Link href="/">Home</Link>
          </li>
          <li className="relative group">
            <span className="cursor-pointer">About</span>
            <ul className="absolute left-0 mt-2 hidden group-hover:block bg-white shadow p-2">
              <li>
                <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100">
                  Contact Us
                </Link>
              </li>
            </ul>
          </li>
          <li className="relative group">
            <span className="cursor-pointer">Programs</span>
            <ul className="absolute left-0 mt-2 hidden group-hover:block bg-white shadow p-2">
              <li>
                <Link href="/coding" className="block px-4 py-2 hover:bg-gray-100">
                  Coding
                </Link>
              </li>
              <li>
                <Link href="/science" className="block px-4 py-2 hover:bg-gray-100">
                  Science
                </Link>
              </li>
              <li>
                <Link href="/math" className="block px-4 py-2 hover:bg-gray-100">
                  Math
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <a
              href="http://ec2-54-209-232-211.compute-1.amazonaws.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              LMS Login
            </a>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col gap-4 p-4">
            <li>
              <Link href="/" onClick={toggleMenu}>Home</Link>
            </li>
            <li>
              <details>
                <summary className="cursor-pointer">About</summary>
                <ul className="pl-4 mt-2">
                  <li>
                    <Link href="/contact" onClick={toggleMenu}>Contact Us</Link>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details>
                <summary className="cursor-pointer">Programs</summary>
                <ul className="pl-4 mt-2">
                  <li>
                    <Link href="/coding" onClick={toggleMenu}>Coding</Link>
                  </li>
                  <li>
                    <Link href="/science" onClick={toggleMenu}>Science</Link>
                  </li>
                  <li>
                    <Link href="/math" onClick={toggleMenu}>Math</Link>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a
                href="http://ec2-54-209-232-211.compute-1.amazonaws.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={toggleMenu}
              >
                LMS Login
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
