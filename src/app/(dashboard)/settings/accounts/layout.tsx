import { Metadata } from "next";

export const metadata: Metadata = { title: "口座 | Money Flows" };

export default function AccountsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
