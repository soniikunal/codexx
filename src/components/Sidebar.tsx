"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LocateIcon,
  MessageCircleCode,
  Users2Icon,
  LucideBookCopy,
  BadgeDollarSign,
  LucideClipboardSignature,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const menuItems = [
  { name: "Users", href: "/admin/subscription", icon: Users },
  { name: "Leads", href: "/admin/contact-entries", icon: LucideClipboardSignature },
  { name: "Programs", href: "/admin/programs", icon: LucideBookCopy },
  { name: "Teachers", href: "/admin/teachers", icon: Users2Icon },
  { name: "Membership", href: "/admin/membership", icon: BadgeDollarSign },
  { name: "Locations", href: "/admin/locations", icon: LocateIcon },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageCircleCode,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "min-h-screen bg-white shadow-lg transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <span className={cn("font-bold text-lg", collapsed && "hidden")}>
          Admin Panel
        </span>
        <Button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <nav className="flex flex-col p-4 gap-2">
        {menuItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className={cn(
              "flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition",
              pathname?.startsWith(href) && "bg-gray-200 font-semibold"
            )}
          >
            <Icon className="w-5 h-5" />
            {!collapsed && name}
          </Link>
        ))}

        <button className="mt-auto flex items-center gap-2 text-sm text-red-600 px-2 py-2 hover:bg-red-50 rounded">
          <LogOut className="w-4 h-4" />
          {!collapsed && "Logout"}
        </button>
      </nav>
    </aside>
  );
}
