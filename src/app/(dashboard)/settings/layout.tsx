"use client";

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
];

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="flex gap-x-8">
      <div className="flex w-48 flex-col">
        {routes.map((route) => (
          <nav key={route.href}>
            <a
              href={route.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                route.href === pathname && "bg-muted font-bold",
              )}
            >
              {route.label}
            </a>
          </nav>
        ))}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
