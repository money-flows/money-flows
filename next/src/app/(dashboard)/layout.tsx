import { NavBar } from "./nav-bar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-[18rem_1fr] min-h-screen">
      <NavBar />
      <main>{children}</main>
    </div>
  );
}
