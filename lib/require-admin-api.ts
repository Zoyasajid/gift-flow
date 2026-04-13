import { cookies } from "next/headers";
import { adminSessionCookieName, verifyAdminSessionToken } from "@/lib/admin-auth";

export async function requireAdminApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookieName)?.value;
  const session = verifyAdminSessionToken(token);
  return session;
}

