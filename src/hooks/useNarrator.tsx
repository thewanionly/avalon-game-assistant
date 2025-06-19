import { useCallback, useEffect, useState } from 'react';

import { NarratorStatus } from '@/constants/narrator';

interface UseNarratorParams {
  text: string;
  initialStatus?: NarratorStatus;
  rate: number[];
}

interface UseNarratorReturnType {
  currentSentence: string | null;
  status: NarratorStatus;
  speak: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export const useNarrator = ({
  text,
  initialStatus = NarratorStatus.IDLE,
  rate,
}: UseNarratorParams): UseNarratorReturnType => {
  const [currentSentence, setCurrentSentence] = useState<string | null>(null);
  const [status, setStatus] = useState<NarratorStatus>(initialStatus);

  const handleSpeak = useCallback(() => {
    if (!text) return;

    if (!('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support the Web Speech API.');
      return;
    }

    const sentences = text
      .split(/\. |\./)
      .filter((v) => v)
      .map((v) => `${v}.`);
    let currSentenceIndex = 0;

    // speak the text one sentence at a time
    const speakSentence = () => {
      if (currSentenceIndex >= sentences.length) {
        // all sentences have been spoken
        setStatus(NarratorStatus.END);
        setCurrentSentence(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentences[currSentenceIndex]);
      utterance.rate = rate[0];
      setCurrentSentence(sentences[currSentenceIndex]);

      // sync with the status state when sentence starts playing
      utterance.onstart = () => setStatus(NarratorStatus.PLAYING);

      // when the current sentence has been spoken, play the next sentence
      utterance.onend = () => {
        setCurrentSentence(null);
        currSentenceIndex++;

        // Insert a dummy pause utterance
        if (currSentenceIndex > 0) {
          const pauseUtterance = new SpeechSynthesisUtterance('pause. pause. pause. pause.');
          pauseUtterance.volume = 0; // Silent
          pauseUtterance.rate = 0.1; // Very slow = fake pause
          pauseUtterance.onend = speakSentence;
          window.speechSynthesis.speak(pauseUtterance);
        }
      };

      // speak the current sentence
      window.speechSynthesis.speak(utterance);
    };

    speakSentence();
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

  return {
    currentSentence,
    status,
    speak: handleSpeak,
    stop: handleStop,
    pause: handlePause,
    resume: handleResume,
  };
};
