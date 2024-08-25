import { Metadata } from "next";

export const metadata: Metadata = { title: "履歴 | Money Flows" };

export default function TransactionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
