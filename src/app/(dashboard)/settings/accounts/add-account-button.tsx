"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

export function AddAccountButton() {
  const { onOpen } = useNewAccount();

  return (
    <Button size="sm" onClick={onOpen}>
      <Plus className="mr-2 size-4" />
      口座を追加
    </Button>
  );
}
