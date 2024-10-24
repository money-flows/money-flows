import { create } from "zustand";

import { CheckedState } from "@/components/ui/checkbox";

interface ImportCsvState {
  content?: string;
  setContent: (content: string | undefined) => void;
  isAutoDetectAmountBySign: CheckedState;
  setIsAutoDetectAmountBySign: (value: CheckedState) => void;
  reset: () => void;
}

const defaultState = {
  content: undefined,
  isAutoDetectAmountBySign: false,
};

export const useImportCsvStore = create<ImportCsvState>((set) => ({
  ...defaultState,
  setContent: (content) => set({ content }),
  setIsAutoDetectAmountBySign: (value) =>
    set({ isAutoDetectAmountBySign: value }),
  reset: () => set(defaultState),
}));
