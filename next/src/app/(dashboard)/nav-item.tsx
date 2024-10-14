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
        "h-9 px-2 flex items-center gap-2 rounded-lg hover:bg-background-gray",
        active && "bg-background-primary hover:bg-background-primary",
      )}
      href={href}
    >
      {icon && (
        <span className={cn("text-text-sub", active && "text-blue-500")}>
          {icon}
        </span>
      )}
      <span className={cn("text-sm font-bold", active && "text-blue-500")}>
        {children}
      </span>
    </Link>
  );
}
