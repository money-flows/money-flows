"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const routes = [
  {
    href: "/settings/accounts",
    label: "口座",
  },
  {
    href: "/settings/categories",
    label: "カテゴリー",
  },
  {
    href: "/settings/tags",
    label: "タグ",
  },
];

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
      <div className="flex w-full flex-col gap-y-1 sm:w-48">
        {routes.map((route) => (
          <nav key={route.href}>
            <Link
              href={route.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-normal hover:bg-muted",
                route.href === pathname && "bg-muted font-semibold opacity-100",
              )}
            >
              {route.label}
            </Link>
          </nav>
        ))}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
