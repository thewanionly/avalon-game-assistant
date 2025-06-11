import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface VoiceSettingsStore {
  rate: number[];
  setRate: (newRate: number[]) => void;
}

export const useVoiceSettingsStore = create<VoiceSettingsStore>()(
  devtools((set) => ({
    rate: [1],
    setRate: (newRate) => set({ rate: newRate }),
  }))
);
