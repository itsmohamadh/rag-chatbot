"use client";

import { UserRole } from "@/db/schema";
import { authClient } from "@/modules/auth/lib/auth-client";

export function useRequireAuth(roles?: UserRole[]) {
  const sessionData = authClient.useSession();

  const user = sessionData.data?.user ?? null;
  const allowedRoles = roles ? roles : null;

  const isAuthenticated = !!user;

  const hasRequiredRole =
    !allowedRoles ||
    (user ? allowedRoles.includes(user.role as UserRole) : false);

  return {
    user,
    isLoading: sessionData.isPending,
    isAuthenticated,
    isAuthorized: isAuthenticated && hasRequiredRole,
    error: sessionData.error,
  };
}
