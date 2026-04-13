import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminSessionCookieName, createAdminSessionToken } from "@/lib/admin-auth";
import { getDb } from "@/lib/firebase-admin";

type Body = {
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Name, email and password are required." },
      { status: 400 }
    );
  }

  const adminEmail = process.env.ADMIN_LOGIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_LOGIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { message: "Admin credentials are not configured in environment." },
      { status: 500 }
    );
  }

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ message: "Invalid admin credentials." }, { status: 401 });
  }

  const db = getDb();
  const userDocRef = db.collection("users").doc(email);
  const existingUser = await userDocRef.get();

  await userDocRef.set(
    {
      name,
      email,
      role: "ADMIN",
      updatedAt: FieldValue.serverTimestamp(),
      ...(existingUser.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge: true }
  );

  const userId = userDocRef.id;

  const token = createAdminSessionToken({
    userId,
    name,
    email,
    role: "ADMIN",
  });

  const response = NextResponse.json({
    ok: true,
    user: { name, email, role: "ADMIN" },
  });

  response.cookies.set(adminSessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}

