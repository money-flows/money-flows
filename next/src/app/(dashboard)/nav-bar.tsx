import { ArrowUpDown, House, LayoutGrid, Plus, Settings } from "lucide-react";
import { NavLink } from "./nav-item";
import { Separator } from "@/components/ui/separator";

const generalLinks = [
  {
    label: "ホーム",
    link: "/",
    icon: House,
  },
  {
    label: "収支",
    link: "/transactions",
    icon: ArrowUpDown,
  },
  {
    label: "カテゴリー",
    link: "/categories",
    icon: LayoutGrid,
  },
];

const dashboardLinks = [
  {
    id: "1",
    name: "ダッシュボード１",
  },
  {
    id: "2",
    name: "ダッシュボード２",
  },
  {
    id: "3",
    name: "ダッシュボード３",
  },
];

export function NavBar() {
  return (
    <nav className="px-4 flex flex-col bg-background-white border-r border-border">
      <div className="py-6 text-sm font-bold">MoneyFlows</div>
      <ul>
        {generalLinks.map(({ label, link, icon: Icon }) => (
          <li key={link}>
            <NavLink href={link} icon={<Icon size={20} />}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <Separator className="my-4" />
      <ul>
        <div className="mb-2 flex items-center justify-between text-text-sub">
          <span className="px-2 font-bold text-xs">ダッシュボード</span>
          <button className="p-1 rounded-md hover:bg-background-gray">
            <Plus size={16} />
          </button>
        </div>
        {dashboardLinks.map(({ id, name }) => (
          <li key={id} className="relative">
            <div className="pl-2 absolute h-full w-5 translate-x-1/2">
              <Separator orientation="vertical" />
            </div>
            <NavLink
              href={`/dashboards/${id}`}
              icon={<div className="size-5" />}
            >
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-auto pb-4">
        <NavLink href="/settings" icon={<Settings size={20} />}>
          設定
        </NavLink>
      </div>
      <Separator />
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="size-8 bg-text-sub/50 rounded-full" />
        <span className="font-bold text-xs">Username</span>
      </div>
    </nav>
  );
}
