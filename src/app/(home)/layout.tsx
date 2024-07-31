import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";

import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { WelcomeMessage } from "@/components/welcome-message";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <header className="h-[22rem] bg-gradient-to-b from-blue-700 to-blue-500 sm:h-96">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-10">
          <div className="mb-6 flex h-16 items-center justify-between sm:mb-12">
            <div className="flex items-center sm:gap-x-8">
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
          <WelcomeMessage />
        </div>
      </header>
      <main className="mx-auto -mt-52 w-full max-w-screen-xl p-4 sm:-mt-56 sm:p-8">
        {children}
      </main>
    </>
  );
}
