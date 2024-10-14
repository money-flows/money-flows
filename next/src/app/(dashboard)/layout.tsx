import { Breadcrumb } from "./bredcrumb";
import { NavBar } from "./nav-bar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-[18rem_1fr] min-h-screen">
      <NavBar />
      <main className="p-6">
        <Breadcrumb />
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
