export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[18rem_1fr] min-h-screen font-[family-name:var(--font-geist-sans)]">
      <nav>Navigation</nav>
      <main>{children}</main>
    </div>
  );
}
