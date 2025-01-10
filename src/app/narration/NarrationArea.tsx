'use client';

import { useCallback, useEffect, useState } from 'react';
import { NarrationForm } from './NarrationForm';
import { Button } from '@/components/ui/button';

export const NarrationArea = () => {
  const [narrationScript, setNarrationScript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleSpeak = useCallback(() => {
    if (!narrationScript) return;

    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) return;

      const utterance = new SpeechSynthesisUtterance(narrationScript);

      // Speak the text
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
      };
    } else {
      alert('Sorry, your browser does not support the Web Speech API.');
    }
  }, [narrationScript]);

  const handleFormSubmit = (value: string) => {
    setNarrationScript(value);
  };

  const handleStopNarration = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setNarrationScript('');
  };

  const handleReplay = () => {
    handleSpeak();
  };

  const handlePauseNarration = () => {
    if (!isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  useEffect(() => {
    handleSpeak();

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
  }, [handleSpeak, narrationScript]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return (
    <>
      <NarrationForm className={narrationScript && 'hidden'} onFormSubmit={handleFormSubmit} />
      {narrationScript && <p className="mt-8">{narrationScript}</p>}
      {isSpeaking && (
        <div className="flex flex-wrap gap-4">
          <Button className="mt-4" variant="destructive" onClick={handleStopNarration}>
            Stop
          </Button>
          <Button className="mt-4" variant="outline" onClick={handlePauseNarration}>
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>
      )}
      {narrationScript && !isSpeaking && (
        <div className="flex flex-wrap gap-4">
          <Button className="mt-4" onClick={handleReplay}>
            Replay
          </Button>
          {/* <Button className="mt-4" variant="outline" onClick={handleChangePlayers}>
               Change players
             </Button> */}
        </div>
      )}
    </>
  );
};
