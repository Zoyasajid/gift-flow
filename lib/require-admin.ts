import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminSessionCookieName, verifyAdminSessionToken } from "@/lib/admin-auth";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookieName)?.value;
  const session = verifyAdminSessionToken(token);

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

