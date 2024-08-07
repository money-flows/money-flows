"use client";

import { H1 } from "@/components/ui/h1";
import { useUserSuspense } from "@/features/auth/hooks/use-user-suspense";

export function WelcomeMessage() {
  const { user } = useUserSuspense();

  return (
    <H1 className="text-3xl font-semibold text-white sm:text-4xl">
      ようこそ、{user?.firstName}さん！
    </H1>
  );
}
