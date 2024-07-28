import { create } from "zustand";

interface ImportConfigState {
  content?: string;
  setContent: (content: string | undefined) => void;
}

export const useImportConfig = create<ImportConfigState>((set) => ({
  content: undefined,
  setContent: (content) => set({ content }),
}));
