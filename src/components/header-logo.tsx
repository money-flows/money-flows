import Image from "next/image";
import Link from "next/link";

export function HeaderLogo() {
  return (
    <Link href="/">
      <div className="hidden items-center lg:flex">
        <Image src="/logo.svg" alt="" height={24} width={24} />
        <p className="ml-2 text-lg font-medium text-white">MoneyFlows</p>
      </div>
    </Link>
  );
}
