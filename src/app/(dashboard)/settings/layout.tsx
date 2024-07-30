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
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex w-full flex-col gap-y-1 lg:w-56">
        {routes.map((route) => (
          <nav key={route.href}>
            <a
              href={route.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-normal hover:bg-muted",
                route.href === pathname && "bg-muted font-semibold opacity-100",
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
