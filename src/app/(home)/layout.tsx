import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";

import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <header className="h-[22rem] bg-gradient-to-b from-blue-700 to-blue-500 sm:h-[23rem]">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-10">
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
      </header>
      <main className="mx-auto mt-[-17rem] w-full max-w-screen-xl p-4 sm:-mt-72 sm:p-8">
        {children}
      </main>
    </>
  );
}
