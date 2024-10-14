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
    name: "収入全般",
  },
  {
    id: "2",
    name: "支出全般",
  },
  {
    id: "3",
    name: "カテゴリー別",
  },
];

export function NavBar() {
  return (
    <nav className="px-4 flex flex-col bg-gray-50 border-r border-gray-100 text-sm leading-4 font-bold">
      <div className="py-6 font-bold">MoneyFlows</div>
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
        <div className="h-8 pl-2 flex items-center justify-between text-gray-500 text-xs">
          ダッシュボード
          <button className="p-1 rounded-md hover:bg-gray-100">
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
      <div className="flex items-center gap-2 px-2 py-4 text-xs">
        <div className="size-8 bg-gray-300 rounded-full" />
        Username
      </div>
    </nav>
  );
}
