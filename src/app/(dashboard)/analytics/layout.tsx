import { Metadata } from "next";

export const metadata: Metadata = { title: "分析 | Money Flows" };

export default function AnalyticsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
