import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminPassword,
  sessionCookieOptions,
} from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const expected = getAdminPassword();
  if (!expected) {
    return NextResponse.json({ ok: false, error: "admin_not_configured" }, { status: 503 });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (password !== expected) {
    return NextResponse.json({ ok: false, error: "invalid_password" }, { status: 401 });
  }

  try {
    const token = await createAdminSessionToken();
    const response = NextResponse.json({ ok: true });
    const cookie = sessionCookieOptions(token);
    response.cookies.set(cookie.name, cookie.value, cookie);
    return response;
  } catch (error) {
    console.error("admin login failed", error);
    return NextResponse.json({ ok: false, error: "session_failed" }, { status: 503 });
  }
}
