import { useCallback, useState } from 'react';

import { NarratorStatus } from '@/constants/narrator';

interface UseNarratorParams {
  initialStatus?: NarratorStatus;
}

interface UseNarratorReturnType {
  status: NarratorStatus;
  speak: (text: string) => void;
  stop: (updateState?: boolean) => void;
  pause: () => void;
  resume: () => void;
}

export const useNarrator = (params?: UseNarratorParams): UseNarratorReturnType => {
  const { initialStatus = NarratorStatus.IDLE } = params ?? {};

  const [status, setStatus] = useState<NarratorStatus>(initialStatus);

  const handleSpeak = useCallback((text: string) => {
    if (!text) return;

    if (!('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support the Web Speech API.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // sync with the status state
    utterance.onstart = () => setStatus(NarratorStatus.PLAYING);
    utterance.onend = () => setStatus(NarratorStatus.END);

    // speak the text
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleStop = useCallback((updateState = true) => {
    window.speechSynthesis.cancel();

    if (updateState) setStatus(NarratorStatus.END);
  }, []);

  const handlePause = useCallback(() => {
    window.speechSynthesis.pause();
    setStatus(NarratorStatus.PAUSED);
  }, []);

  const handleResume = useCallback(() => {
    window.speechSynthesis.resume();
    setStatus(NarratorStatus.PLAYING);
  }, []);

  return { status, speak: handleSpeak, stop: handleStop, pause: handlePause, resume: handleResume };
};
