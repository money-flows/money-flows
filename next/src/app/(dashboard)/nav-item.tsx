import { cn } from "@/lib/utils";
import Link from "next/link";

type NavLinkProps = Readonly<{
  children: React.ReactNode;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
}>;

export function NavLink({ children, href, icon, active }: NavLinkProps) {
  return (
    <Link
      className={cn(
        "h-9 px-2 flex items-center gap-2 rounded-lg text-sm hover:bg-gray-100",
        active && "bg-blue-50 hover:bg-blue-50",
      )}
      href={href}
    >
      {icon && (
        <span className={cn("text-gray-500", active && "text-blue-500")}>
          {icon}
        </span>
      )}
      <span className={cn("text-sm text-gray-800", active && "text-blue-500")}>
        {children}
      </span>
    </Link>
  );
}
