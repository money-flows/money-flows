"use client";

import { useUser } from "@clerk/nextjs";

export function useUserSuspense() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    throw new Promise<void>((resolve, reject) => {
      if (isLoaded) {
        resolve();
      }
      reject();
    });
  }

  return {
    isSignedIn,
    user,
  };
}
