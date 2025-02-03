'use client';

import { useState } from 'react';
import { NarrationForm } from '../NarrationForm';
import { DEFAULT_NARRATION_FORM_VALUES } from '../NarrationForm/NarrationForm.constants';
import { NarrationPlayer } from '../NarrationPlayer';
import { NarratorStatus } from '@/constants/narrator';

enum NarrationStatus {
  SELECTION = 'selection',
  NARRATING = 'narrating',
}
export const NarrationArea = () => {
  const [narrationStatus, setNarrationStatus] = useState<NarrationStatus>(
    NarrationStatus.SELECTION
  );
  const [narrationScript, setNarrationScript] = useState('');

  const handleFormSubmit = (value: string) => {
    setNarrationScript(value);
    setNarrationStatus(NarrationStatus.NARRATING);
  };

  const handleNarrationPlayerClose = () => {
    setNarrationStatus(NarrationStatus.SELECTION);
  };

  return (
    <>
      <NarrationForm
        className={narrationStatus === NarrationStatus.NARRATING ? 'hidden' : '*:'}
        defaultValues={DEFAULT_NARRATION_FORM_VALUES}
        onFormSubmit={handleFormSubmit}
      />
      {narrationStatus === NarrationStatus.NARRATING && (
        <NarrationPlayer
          narrationScript={narrationScript}
          initialStatus={NarratorStatus.PLAYING}
          onClose={handleNarrationPlayerClose}
        />
      )}
    </>
  );
};
