"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/h1";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

import { AccountTable } from "./account-table";

export default function AccountsPage() {
  const { onOpen } = useNewAccount();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <H1>口座</H1>
        <Button onClick={onOpen}>
          <Plus className="mr-2 size-4" />
          口座を追加
        </Button>
      </div>
      <AccountTable />
    </div>
  );
}
