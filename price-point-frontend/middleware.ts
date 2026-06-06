import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Proteksi halaman History
  if (pathname.startsWith("/history") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika sudah login, jangan biarkan masuk ke halaman login lagi
  if (pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/history/:path*", "/login"],
};
