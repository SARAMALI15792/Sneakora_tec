import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const { pathname } = request.nextUrl;

  // Admin routes require admin role
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    if (session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes require any authenticated user
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/profile/:path*",
    "/wishlist",
    "/orders/:path*",
    "/checkout",
    "/admin/:path*",
  ],
};