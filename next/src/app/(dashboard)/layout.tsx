import {
  ArrowUpDown,
  ChartColumnIncreasing,
  ChevronDown,
  House,
  LayoutGrid,
  Plus,
} from "lucide-react";

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

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-[18rem_1fr] min-h-screen">
      <nav className="px-4 flex flex-col bg-gray-50 border-r border-gray-100 text-sm leading-4 font-bold">
        <div className="py-6 font-bold text-xl">MoneyFlows</div>
        <ul>
          {generalLinks.map(({ label, link, icon: Icon }) => (
            <li key={link}>
              <a
                className="p-2 flex items-center gap-2 rounded-lg hover:bg-gray-100"
                href={link}
              >
                <Icon className="text-gray-500" size={20} />
                {label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="mt-8">
          <button className="w-full p-2 flex items-center gap-2 rounded-lg hover:bg-gray-100">
            <ChartColumnIncreasing className="text-gray-500" size={20} />
            ダッシュボード
            <ChevronDown className="text-gray-500 ml-auto" size={16} />
          </button>
          {dashboardLinks.map(({ id, name }) => (
            <li key={id} className="relative">
              <div className="pl-2 absolute h-full w-5 translate-x-1/2">
                <div className="border-l border-gray-300 h-full" />
              </div>
              <a
                className="p-2 flex items-center gap-2 text-gray-600 rounded-lg hover:bg-gray-100"
                href={`/dashboards/${id}`}
              >
                <div className="size-5" />
                {name}
              </a>
            </li>
          ))}
          <button className="w-full p-2 flex items-center gap-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <Plus size={16} />
            新しいダッシュボード
          </button>
        </ul>
        <div className="mt-auto flex items-center gap-2 px-2 py-6 text-xs">
          <div className="size-8 bg-gray-300 rounded-full" />
          Username
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
