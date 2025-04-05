import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("__mtoken")?.value;
  const { pathname } = request.nextUrl;
  // Protected routes
  const protectedRoutes = ["/profile"];

  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/getstarted", request.url));
  }

  // If user is logged in & trying to access /login or /getstarted → Redirect to /profile

  if (token && pathname.startsWith("/getstarted")) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/getstarted"],
};
