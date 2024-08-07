"use client";

import { useUser } from "@clerk/nextjs";

export function SignedInSuspense({ children }: { children: React.ReactNode }) {
  const user = useUser();

  if (!user.isLoaded) {
    throw new Promise<void>((resolve, reject) => {
      if (user.isLoaded) {
        resolve();
      }
      reject();
    });
  }

  return <>{children}</>;
}
