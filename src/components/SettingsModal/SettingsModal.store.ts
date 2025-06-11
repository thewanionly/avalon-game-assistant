import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SettingsModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useSettingsModalStore = create<SettingsModalStore>()(
  devtools((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
  }))
);
