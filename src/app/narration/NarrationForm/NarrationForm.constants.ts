import { DEFAULT_EVIL_CHARACTERS, DEFAULT_GOOD_CHARACTERS } from '@/constants/characters';

export const DEFAULT_NARRATION_FORM_VALUES = {
  goodCharacters: DEFAULT_GOOD_CHARACTERS.map(({ id }) => id),
  evilCharacters: DEFAULT_EVIL_CHARACTERS.map(({ id }) => id),
};
