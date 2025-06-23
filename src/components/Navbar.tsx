"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="top-0 left-0 w-full z-50 bg-black shadow transition-transform duration-300 text-white">
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="hover:underline">
          <Image src="/logo.png" alt="Logo" width={100} height={50} />
        </Link>
      </div>
    </nav>
  );
}
