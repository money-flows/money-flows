"use client";

import { useUser } from "@clerk/nextjs";

import { H1 } from "./ui/h1";
import { Skeleton } from "./ui/skeleton";

export function WelcomeMessage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <Skeleton className="h-8 w-72 opacity-5 sm:h-9" />;
  }

  return (
    <H1 className="text-3xl font-semibold text-white sm:text-4xl">
      ようこそ、{user?.firstName}さん！
    </H1>
  );
}
