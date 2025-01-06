'use client';

import { useEffect, useState } from 'react';
import { NarrationForm } from './NarrationForm';
import { Button } from '@/components/ui/button';

export const NarrationArea = () => {
  const [narrationScript, setNarrationScript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleFormSubmit = (value: string) => {
    setNarrationScript(value);
  };

  const handleStopNarration = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setNarrationScript('');
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
    if (!narrationScript) return;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(narrationScript);

      // Speak the text
      window.speechSynthesis.speak(utterance);

      setIsSpeaking(true);
    } else {
      alert('Sorry, your browser does not support the Web Speech API.');
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
  }, [narrationScript]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return (
    <>
      <NarrationForm onFormSubmit={handleFormSubmit} />
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
    </>
  );
};
