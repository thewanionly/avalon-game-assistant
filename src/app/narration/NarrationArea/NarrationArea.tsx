'use client';

import { useEffect, useState } from 'react';

import Cookie from 'js-cookie';

import { NarrationForm } from '../NarrationForm';
import { DEFAULT_NARRATION_FORM_VALUES } from '../NarrationForm/NarrationForm.constants';
import { NarrationPlayer } from '../NarrationPlayer';
import { NarratorStatus } from '@/constants/narrator';
import { NarrationFormValuesType } from '../NarrationForm/NarrationForm.schema';
import { generateNarrationScript } from '@/helper/generateNarrationScript';
import { AVALON_CHARACTERS, AvalonCharacterName } from '@/constants/characters';
import { checkTeamBalance } from '@/helper/checkTeamBalance';
import { TeamBalanceAlertDialog } from '@/components/TeamBalanceAlertDialog';

enum NarrationStatus {
  SELECTION = 'selection',
  NARRATING = 'narrating',
}
export const NarrationArea = () => {
  const [teamBalanceMessage, setTeamBalanceMessage] = useState('');
  const [narrationStatus, setNarrationStatus] = useState<NarrationStatus>(
    NarrationStatus.SELECTION
  );
  const [narrationScript, setNarrationScript] = useState('');

  const handleCancel = () => {
    setTeamBalanceMessage('');
  };

  const handleProcced = () => {
    setTeamBalanceMessage('');
    setNarrationStatus(NarrationStatus.NARRATING);
  };

  const handleFormSubmit = (values: NarrationFormValuesType) => {
    const { goodCharacters = [], evilCharacters = [] } = values;

    // Save selected characters to a cookie
    Cookie.set('selected-characters', JSON.stringify(values), {
      expires: 1000,
    });

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

    const { isBalanced, message } = checkTeamBalance({
      hasMordred,
      hasMorgana,
      hasOberon,
      hasPercival,
    });

    setNarrationScript(generateNarrationScript({ hasMordred, hasMorgana, hasOberon, hasPercival }));

    if (!isBalanced) {
      setTeamBalanceMessage(message);
      return;
    }

    setNarrationStatus(NarrationStatus.NARRATING);
  };

  const handleNarrationPlayerClose = () => {
    setNarrationStatus(NarrationStatus.SELECTION);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [narrationStatus]);

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
      <TeamBalanceAlertDialog
        open={Boolean(teamBalanceMessage)}
        message={teamBalanceMessage}
        onCancel={handleCancel}
        onProceed={handleProcced}
      />
    </>
  );
};
