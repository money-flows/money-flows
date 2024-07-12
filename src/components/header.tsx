import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";

import { HeaderLogo } from "./header-logo";
import { Navigation } from "./navigation";
import { Skeleton } from "./ui/skeleton";
import { WelcomeMessage } from "./welcome-message";

export function Header() {
  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 pb-36 lg:px-14">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-14 flex w-full items-center justify-between">
          <div className="flex items-center lg:gap-x-24">
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
  );
}
