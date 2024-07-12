"use client";

import { useUser } from "@clerk/nextjs";

import { Skeleton } from "./ui/skeleton";

export function WelcomeMessage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="mb-4 space-y-4">
        <Skeleton className="h-8 w-72 opacity-5 lg:h-9" />
        <Skeleton className="h-5 w-[22rem] opacity-5 lg:h-6" />
      </div>
    );
  }

  return (
    <div className="mb-4 space-y-4">
      <h2 className="text-2xl font-bold text-white lg:text-3xl">
        ようこそ、{user?.firstName}さん！
      </h2>
      <p className="text-sm text-blue-100 lg:text-base">
        こちらは、あなたの収支管理ダッシュボードです。
      </p>
    </div>
  );
}
