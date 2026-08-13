import { userRoleEnum } from "@/db/schema";
import { auth } from "@/modules/auth/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

type UserRole = (typeof userRoleEnum.enumValues)[number];

export async function requireAuth(roles?: UserRole[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Unauthenticated" },
        { status: 401 },
      ),
    };
  }

  if (roles && !roles.includes(session.user.role as UserRole)) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 403 }),
    };
  }

  return {
    user: session.user,
    response: null,
  };
}
