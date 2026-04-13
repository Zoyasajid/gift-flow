import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminSessionCookieName, verifyAdminSessionToken } from "@/lib/admin-auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookieName)?.value;
  const session = verifyAdminSessionToken(token);

  if (!session) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: session.userId,
      name: session.name,
      email: session.email,
      role: session.role,
    },
  });
}

