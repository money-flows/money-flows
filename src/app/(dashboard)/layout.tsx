import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";

import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <header className="bg-gradient-to-b from-blue-700 to-blue-500">
        <div className="mx-auto max-w-screen-2xl p-4 lg:px-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center lg:gap-x-8">
              <HeaderLogo />
              <Navigation />
            </div>
            <ClerkLoaded>
              <UserButton />
            </ClerkLoaded>
            <ClerkLoading>
              <Skeleton className="size-7 rounded-full opacity-20" />
            </ClerkLoading>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-screen-2xl p-3 lg:p-6">
        {children}
      </main>
    </>
  );
}
