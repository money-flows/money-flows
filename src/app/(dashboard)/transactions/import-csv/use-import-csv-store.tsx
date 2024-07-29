import { create } from "zustand";

import { CheckedState } from "@/components/ui/checkbox";

interface ImportCsvState {
  content?: string;
  setContent: (content: string | undefined) => void;
  isAutoDetectAmountBySign: CheckedState;
  setIsAutoDetectAmountBySign: (value: CheckedState) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importedTransactions?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setImportedTransactions: (transactions: any) => void;
}

export const useImportCsvStore = create<ImportCsvState>((set) => ({
  content: undefined,
  setContent: (content) => set({ content }),
  isAutoDetectAmountBySign: false,
  setIsAutoDetectAmountBySign: (value) =>
    set({ isAutoDetectAmountBySign: value }),
  importedTransactions: undefined,
  setImportedTransactions: (transactions) =>
    set({ importedTransactions: transactions }),
}));
