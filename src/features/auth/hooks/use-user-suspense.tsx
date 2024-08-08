"use client";

import { useUser } from "@clerk/nextjs";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useUserSuspense() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    throw sleep(100);
  }

  return {
    isSignedIn,
    user,
  };
}
