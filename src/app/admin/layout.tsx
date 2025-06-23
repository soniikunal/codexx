import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="bg-gray-50 min-h-screen flex">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="p-4">{children}</main>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
