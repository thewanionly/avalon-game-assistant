'use client';

import { useState } from 'react';
import { NarrationForm } from '../NarrationForm';
import { DEFAULT_NARRATION_FORM_VALUES } from '../NarrationForm/NarrationForm.constants';
import { NarrationPlayer } from '../NarrationPlayer';
import { NarratorStatus } from '@/constants/narrator';
import { NarrationFormValuesType } from '../NarrationForm/NarrationForm.schema';
import { generateNarrationScript } from '@/helper/generateNarrationScript';
import { AVALON_CHARACTERS, AvalonCharacterName } from '@/constants/characters';

enum NarrationStatus {
  SELECTION = 'selection',
  NARRATING = 'narrating',
}
export const NarrationArea = () => {
  const [narrationStatus, setNarrationStatus] = useState<NarrationStatus>(
    NarrationStatus.SELECTION
  );
  const [narrationScript, setNarrationScript] = useState('');

  const handleFormSubmit = ({
    goodCharacters = [],
    evilCharacters = [],
  }: NarrationFormValuesType) => {
    // check if any of the special characters are selected
    const hasPercival = goodCharacters.some(
      (charId) => AVALON_CHARACTERS[charId].name === AvalonCharacterName.Percival
    );
    const hasMordred = evilCharacters.some(
      (charId) => AVALON_CHARACTERS[charId].name === AvalonCharacterName.Mordred
    );
    const hasMorgana = evilCharacters.some(
      (charId) => AVALON_CHARACTERS[charId].name === AvalonCharacterName.Morgana
    );
    const hasOberon = evilCharacters.some(
      (charId) => AVALON_CHARACTERS[charId].name === AvalonCharacterName.Oberon
    );

    setNarrationScript(generateNarrationScript({ hasMordred, hasMorgana, hasOberon, hasPercival }));
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
