"use client";

import { authClient } from "@/modules/auth/lib/auth-client";

export function useRequireAuth() {
  const sessionData = authClient.useSession();

  return {
    user: sessionData.data?.user ?? null,
    isLoading: sessionData.isPending,
    isAuthenticated: !!sessionData.data?.user,
    error: sessionData.error,
  };
}
