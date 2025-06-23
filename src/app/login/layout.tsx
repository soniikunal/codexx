import Image from "next/image";
import React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Logo section at top */}
      <div className="w-full py-3 flex justify-center shadow-sm bg-gray-800">
        <Image src="/logo.png" alt="Logo" width={120} height={60} />
      </div>

      {/* Centered form */}
      <div className="flex-grow flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
