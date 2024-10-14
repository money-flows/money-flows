"use client";

import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowUpDown,
  ChartBarIncreasing,
  House,
  LayoutGrid,
} from "lucide-react";
import { usePathname } from "next/navigation";

type BreadcrumbItem = Readonly<
  | {
      type: "link";
      name: string;
      href: string;
    }
  | {
      type: "page";
      name: string;
    }
>;

function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  if (pathname === "/") {
    return [
      {
        type: "page",
        name: "ホーム",
      },
    ];
  }

  if (pathname.startsWith("/transactions")) {
    return [
      {
        type: "link",
        name: "ホーム",
        href: "/",
      },
      {
        type: "page",
        name: "収支",
      },
    ];
  }

  if (pathname.startsWith("/categories")) {
    return [
      {
        type: "link",
        name: "ホーム",
        href: "/",
      },
      {
        type: "page",
        name: "カテゴリー",
      },
    ];
  }

  if (pathname.startsWith("/dashboards")) {
    return [
      {
        type: "link",
        name: "ホーム",
        href: "/",
      },
      {
        type: "link",
        name: "ダッシュボード",
        href: "/",
      },
      {
        type: "page",
        name: "ダッシュボード１",
      },
    ];
  }

  return [];
}

export function Breadcrumb() {
  const pathname = usePathname();
  const items = getBreadcrumbItems(pathname);

  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        {items
          .flatMap((item, index) => [
            <BreadcrumbSeparator key={`separator-${index}`} />,
            <BreadcrumbItem key={item.name}>
              {item.type === "link" ? (
                <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>,
          ])
          .slice(1)}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
}
