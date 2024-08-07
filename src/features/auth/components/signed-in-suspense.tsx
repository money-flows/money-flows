"use client";

import { useUserSuspense } from "../hooks/use-user-suspense";

interface SignedInSuspenseProps {
  children: React.ReactNode;
}

export function SignedInSuspense({ children }: SignedInSuspenseProps) {
  const _ = useUserSuspense();
  return <>{children}</>;
}
