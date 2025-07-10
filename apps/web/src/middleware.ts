import { auth } from "@opencut/auth/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Handle fuckcapcut.com domain redirect
  if (request.headers.get("host") === "fuckcapcut.com") {
    return NextResponse.redirect("https://opencut.app/why-not-capcut", 301);
  }

  const path = request.nextUrl.pathname;

  if (path === "/editor" && process.env.NODE_ENV === "production") {
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("redirect", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/projects", "/editor/:path*"],
};
