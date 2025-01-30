'use client';

import { useCallback, useEffect, useState } from 'react';
import { NarrationForm } from './NarrationForm';
import { Button } from '@/components/ui/button';
import { DEFAULT_NARRATION_FORM_VALUES } from './NarrationForm/NarrationForm.constants';

enum NarrationStatus {
  SELECTION = 'selection',
  NARRATING = 'narrating',
}
export const NarrationArea = () => {
  const [narrationStatus, setNarrationStatus] = useState<NarrationStatus>(
    NarrationStatus.SELECTION
  );
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
    setNarrationStatus(NarrationStatus.NARRATING);
  };

  const handleStopNarration = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setNarrationScript('');
    setNarrationStatus(NarrationStatus.SELECTION);
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
      <NarrationForm
        className={narrationStatus === NarrationStatus.NARRATING ? 'hidden' : '*:'}
        defaultValues={DEFAULT_NARRATION_FORM_VALUES}
        onFormSubmit={handleFormSubmit}
      />
      {narrationStatus === NarrationStatus.NARRATING && (
        <>
          <p className="mt-8">{narrationScript}</p>
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
          {!isSpeaking && (
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
      )}
    </>
  );
};
