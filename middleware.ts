import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function requestHost(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-host");
  const raw = (forwarded ?? request.headers.get("host") ?? request.nextUrl.hostname)
    .split(",")[0]
    .trim()
    .toLowerCase();
  return raw.split(":")[0];
}

export function middleware(request: NextRequest) {
  const host = requestHost(request);

  if (host === "www.makoto-hk.com") {
    const destination = new URL(request.url);
    destination.hostname = "makoto-hk.com";
    destination.protocol = "https:";
    destination.port = "";
    return NextResponse.redirect(destination, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
