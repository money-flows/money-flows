import { H1 } from "@/components/ui/h1";

import { AccountTable } from "./account-table";
import { AddAccountButton } from "./add-account-button";

export default function AccountsPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <H1>口座</H1>
        <AddAccountButton />
      </div>
      <AccountTable />
    </div>
  );
}
