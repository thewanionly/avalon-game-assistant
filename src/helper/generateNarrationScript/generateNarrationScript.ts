import { arrayToString } from '@/utils/arrayToString';
import {
  ALL_PLAYERS_HANDS_CLOSED_HANDS_FIST,
  CLOSING,
  INTRO,
  MERLIN_SCRIPT,
  MERLIN_WITH_MORDRED_SCRIPT,
  MINIONS_OF_MORDRED_SCRIPT,
  MINIONS_OF_MORDRED_WITH_OBERON_SCRIPT,
  PERCIVAL_SCRIPT,
  PERCIVAL_WITH_MORGANA_SCRIPT,
} from './generateNarrationScript.constants';
import { OptionalCharacterFlags } from '@/constants/characters';

export const generateNarrationScript = (flags?: OptionalCharacterFlags): string => {
  const {
    hasMordred = false,
    hasOberon = false,
    hasPercival = false,
    hasMorgana = false,
  } = flags ?? {};

  const narrationScript = arrayToString([
    INTRO,
    hasOberon ? MINIONS_OF_MORDRED_WITH_OBERON_SCRIPT : MINIONS_OF_MORDRED_SCRIPT,
    ALL_PLAYERS_HANDS_CLOSED_HANDS_FIST,
    hasMordred ? MERLIN_WITH_MORDRED_SCRIPT : MERLIN_SCRIPT,
    ALL_PLAYERS_HANDS_CLOSED_HANDS_FIST,
    hasPercival ? (hasMorgana ? PERCIVAL_WITH_MORGANA_SCRIPT : PERCIVAL_SCRIPT) : '',
    CLOSING,
  ]);

  return narrationScript;
};
