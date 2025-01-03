'use client';

import { useEffect, useState } from 'react';
import { NarrationForm } from './NarrationForm';

export const NarrationArea = () => {
  const [narrationScript, setNarrationScript] = useState('');

  const handleFormSubmit = (value: string) => {
    setNarrationScript(value);
  };

  useEffect(() => {
    if (!narrationScript) return;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(narrationScript);

      // Speak the text
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support the Web Speech API.');
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [narrationScript]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return (
    <div>
      <NarrationForm onFormSubmit={handleFormSubmit} />
      {narrationScript}
    </div>
  );
};
