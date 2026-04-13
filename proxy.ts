import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow admin login page (public)
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect all /admin routes — require session cookie
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("giftflow_admin_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Block public users from accessing admin API routes
  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("giftflow_admin_session")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
