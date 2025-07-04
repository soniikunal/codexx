import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Only protect /admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  console.log(request.nextUrl);
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      verifyToken(token); // Will throw if invalid
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/admin/:path*"], // 👈 Only applies to /admin and its subpages
};
