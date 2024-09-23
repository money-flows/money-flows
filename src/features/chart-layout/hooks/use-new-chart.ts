import { create } from "zustand";

interface NewChartState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useNewChart = create<NewChartState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
