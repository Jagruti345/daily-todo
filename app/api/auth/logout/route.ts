import { clearSessionCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error) {
    console.error("POST /api/auth/logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
