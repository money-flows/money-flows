import { create } from "zustand";

import { CheckedState } from "@/components/ui/checkbox";

interface ImportCsvState {
  content?: string;
  setContent: (content: string | undefined) => void;
  isAutoDetectAmountBySign: CheckedState;
  setIsAutoDetectAmountBySign: (value: CheckedState) => void;
}

export const useImportCsvStore = create<ImportCsvState>((set) => ({
  content: undefined,
  setContent: (content) => set({ content }),
  isAutoDetectAmountBySign: false,
  setIsAutoDetectAmountBySign: (value) =>
    set({ isAutoDetectAmountBySign: value }),
}));
