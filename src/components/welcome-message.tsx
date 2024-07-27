"use client";

import { useUser } from "@clerk/nextjs";

import { Skeleton } from "./ui/skeleton";

export function WelcomeMessage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <Skeleton className="h-8 w-72 opacity-5 lg:h-9" />;
  }

  return (
    <h2 className="text-2xl font-bold text-white lg:text-3xl">
      ようこそ、{user?.firstName}さん！
    </h2>
  );
}
