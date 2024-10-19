import { Metadata } from "next";

export const metadata: Metadata = { title: "タグ | Money Flows" };

export default function CategoriesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
