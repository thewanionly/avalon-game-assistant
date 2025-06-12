import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface VoiceSettingsStore {
  rate: number[];
  setRate: (newRate: number[]) => void;
  incrementRate: () => void;
  decrementRate: () => void;
}

export const useVoiceSettingsStore = create<VoiceSettingsStore>()(
  devtools((set) => ({
    rate: [1],
    setRate: (newRate) => set({ rate: newRate }),
    incrementRate: () => set((state) => ({ rate: [state.rate[0] + 0.1] })),
    decrementRate: () => set((state) => ({ rate: [state.rate[0] - 0.1] })),
  }))
);
