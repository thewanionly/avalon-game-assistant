import { useState } from 'react';

import { NarratorStatus } from '@/constants/narrator';

interface UseNarratorParams {
  initialStatus?: NarratorStatus;
}

interface UseNarratorReturnType {
  status: NarratorStatus;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export const useNarrator = (params?: UseNarratorParams): UseNarratorReturnType => {
  const { initialStatus = NarratorStatus.IDLE } = params ?? {};

  const [status, setStatus] = useState<NarratorStatus>(initialStatus);

  const handleSpeak = (text: string) => {
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
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setStatus(NarratorStatus.END);
  };

  const handlePause = () => {
    if (status === NarratorStatus.PAUSED) return;

    window.speechSynthesis.pause();
    setStatus(NarratorStatus.PAUSED);
  };

  const handleResume = () => {
    if (status !== NarratorStatus.PAUSED) return;

    window.speechSynthesis.resume();
    setStatus(NarratorStatus.PLAYING);
  };

  return { status, speak: handleSpeak, stop: handleStop, pause: handlePause, resume: handleResume };
};
