import { useCallback, useEffect, useState } from 'react';

import { NarratorStatus } from '@/constants/narrator';

interface UseNarratorParams {
  text: string;
  initialStatus?: NarratorStatus;
}

interface UseNarratorReturnType {
  status: NarratorStatus;
  speak: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export const useNarrator = ({
  text,
  initialStatus = NarratorStatus.IDLE,
}: UseNarratorParams): UseNarratorReturnType => {
  const [status, setStatus] = useState<NarratorStatus>(initialStatus);

  const handleSpeak = useCallback(() => {
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
  }, [text]);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  const handlePause = useCallback(() => {
    window.speechSynthesis.pause();
    setStatus(NarratorStatus.PAUSED);
  }, []);

  const handleResume = useCallback(() => {
    window.speechSynthesis.resume();
    setStatus(NarratorStatus.PLAYING);
  }, []);

  useEffect(() => {
    if (initialStatus !== NarratorStatus.PLAYING) return;

    // start narrator if initialStatus is playing
    handleSpeak();

    const handleBeforeUnload = () => {
      // stop narrator during page reload
      window.speechSynthesis.cancel();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // stop narrator in the next time this useEffect is run (e.g. component unmounts)
      window.speechSynthesis.cancel();
    };
  }, [initialStatus, handleSpeak]);

  return { status, speak: handleSpeak, stop: handleStop, pause: handlePause, resume: handleResume };
};
