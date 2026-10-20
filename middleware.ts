import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_COOKIE } from "@/lib/adminConstants";

function requestHost(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-host");
  const raw = (forwarded ?? request.headers.get("host") ?? request.nextUrl.hostname)
    .split(",")[0]
    .trim()
    .toLowerCase();
  return raw.split(":")[0];
}

async function hasAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!token || !secret || secret.length < 16) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const host = requestHost(request);

  if (host === "www.makoto-hk.com") {
    const destination = new URL(request.url);
    destination.hostname = "makoto-hk.com";
    destination.protocol = "https:";
    destination.port = "";
    return NextResponse.redirect(destination, 308);
  }

  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin/calendar") || path.startsWith("/admin/bookings")) {
    if (!(await hasAdminSession(request))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
