// src/components/Footer.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaArrowUp,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gray-300 text-gray-700 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div>
          <Link href="/" className="hover:underline">
            <Image src="/logo.png" alt="Logo" width={200} height={50} />
          </Link>
          <p className="mt-4">
            We take our mission of increasing global access to quality education
            seriously.
          </p>
        </div>

        {/* Mission Statement */}
        <div>
          {/* <h3 className="text-lg font-semibold mb-2">Our Mission</h3>
          <p>
            We take our mission of increasing global access to quality education
            seriously.
          </p> */}
          <h3 className="text-lg font-semibold mb-2">CONTACT US</h3>
          <p className="mb-1">Get in Touch</p>
          <p className="mb-1">136 Great Rd, Acton, MA-01719</p>
          <a href="tel:9782747244" className="hover:text-blue-600">
            <p className="mb-1">(978) 274 7244</p>
          </a>
          <a
            href="mailto:info@brainsandbrawns.com"
            className="hover:text-blue-600"
          >
            <p className="mb-1">info@brainsandbrawns.com</p>
          </a>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Subscribe to our newsletter
          </h3>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full"
            />
            <Button className="cta">Subscribe</Button>
          </div>
          <div className="flex  gap-4 text-xl mt-4">
            <a
              //   href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="hover:text-blue-600" />
            </a>
            <a
              //   href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="hover:text-pink-500" />
            </a>
            <a
              //   href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="hover:text-blue-800" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t mt-12 pt-6 px-4 text-sm text-center space-y-4">
        <p>All rights reserved</p>
        <div className="flex justify-center gap-4">
          <a href="#" className="hover:underline">
            Privacy & Policy
          </a>
          <a href="#" className="hover:underline">
            Terms & Conditions
          </a>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gray-700 text-white p-3 rounded-full shadow hover:bg-black transition cursor-pointer"
        >
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
}
