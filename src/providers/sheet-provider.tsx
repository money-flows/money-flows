"use client";

import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet";
import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet";

export function SheetProvider() {
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />

      <NewTransactionSheet />
      <EditTransactionSheet />
    </>
  );
}
