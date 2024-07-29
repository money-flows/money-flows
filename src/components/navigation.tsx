"use client";

import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useIsMobile } from "@/hooks/use-is-mobile";

import { NavButton } from "./nav-button";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const routes = [
  {
    href: "/",
    label: "ホーム",
  },
  {
    href: "/transactions",
    label: "履歴",
  },
  {
    href: "/settings/accounts",
    label: "設定",
  },
];

function isActive(href: string, pathname: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (pathname.includes("/settings")) {
    return href === "/settings/accounts";
  }

  return pathname.includes(href);
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const handleClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-none bg-white/10 font-normal text-white outline-none transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus-visible:ring-transparent focus-visible:ring-offset-0"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={isActive(route.href, pathname) ? "secondary" : "ghost"}
                onClick={() => handleClick(route.href)}
                className="w-full justify-start"
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden items-center gap-x-2 overflow-x-auto lg:flex">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={isActive(route.href, pathname)}
        />
      ))}
    </nav>
  );
}
