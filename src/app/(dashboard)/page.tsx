"use client";

import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/hooks/use-new-account";

export default function Home() {
  const { onOpen } = useNewAccount();

  return (
    <div>
      <Button onClick={onOpen}>口座を追加</Button>
    </div>
  );
}
