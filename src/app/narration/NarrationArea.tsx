'use client';

import { useEffect, useState } from 'react';
import { NarrationForm } from './NarrationForm';
import { Button } from '@/components/ui/button';

export const NarrationArea = () => {
  const [narrationScript, setNarrationScript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleFormSubmit = (value: string) => {
    setNarrationScript(value);
  };

  const handleStopNarration = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setNarrationScript('');
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
    <div>
      <NarrationForm onFormSubmit={handleFormSubmit} />
      <p className="mt-8">{narrationScript}</p>
      {isSpeaking && (
        <Button className="mt-4" variant="destructive" onClick={handleStopNarration}>
          Stop
        </Button>
      )}
    </div>
  );
};
