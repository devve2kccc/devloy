import { create } from "zustand";

type NewServiceState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewService = create<NewServiceState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
