import {
  EVIL_REQUIRED_CHARACTERS,
  GOOD_REQUIRED_CHARACTERS,
  TEAM_DISTRIBUTION,
} from '@/constants/characters';
import {
  ERROR_CHARACTER_DISTRIBUTION,
  ERROR_MAX_PLAYERS,
  ERROR_MIN_PLAYERS,
  ERROR_REQUIRED_CHARACTERS,
} from '@/constants/errorMessages';
import { dynamicString } from '@/utils/dynamicString';
import { z } from 'zod';
import { MAX_PLAYERS, MIN_PLAYERS } from './NarrationForm.constants';

export const NarrationFormSchema = z
  .object({
    goodCharacters: z
      .array(z.string())
      .refine((values) => GOOD_REQUIRED_CHARACTERS.every(({ id }) => values.includes(id)), {
        message: dynamicString(ERROR_REQUIRED_CHARACTERS, {
          requiredCharacters: GOOD_REQUIRED_CHARACTERS.map(({ name }) => name).join(', '),
        }),
      }),
    evilCharacters: z
      .array(z.string())
      .refine((values) => EVIL_REQUIRED_CHARACTERS.every(({ id }) => values.includes(id)), {
        message: dynamicString(ERROR_REQUIRED_CHARACTERS, {
          requiredCharacters: EVIL_REQUIRED_CHARACTERS.map(({ name }) => name).join(', '),
        }),
      }),
  })
  .refine(
    ({ goodCharacters, evilCharacters }) => {
      const numberOfPlayers = goodCharacters.length + evilCharacters.length;

      return numberOfPlayers >= MIN_PLAYERS;
    },
    {
      path: [],
      message: dynamicString(ERROR_MIN_PLAYERS, { minPlayers: MIN_PLAYERS }),
    }
  )
  .refine(
    ({ goodCharacters, evilCharacters }) => {
      const numberOfPlayers = goodCharacters.length + evilCharacters.length;

      return numberOfPlayers <= MAX_PLAYERS;
    },
    {
      path: [],
      message: dynamicString(ERROR_MAX_PLAYERS, { maxPlayers: MAX_PLAYERS }),
    }
  )
  .superRefine(({ goodCharacters, evilCharacters }, ctx) => {
    const numberOfPlayers = goodCharacters.length + evilCharacters.length;

    if (numberOfPlayers >= MIN_PLAYERS && numberOfPlayers <= MAX_PLAYERS) {
      const { good: goodPlayersCount, evil: evilPlayersCount } =
        TEAM_DISTRIBUTION[numberOfPlayers as keyof typeof TEAM_DISTRIBUTION];

      const isValidDistribution =
        goodCharacters.length === goodPlayersCount && evilCharacters.length === evilPlayersCount;

      if (!isValidDistribution) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: dynamicString(ERROR_CHARACTER_DISTRIBUTION, {
            numberOfPlayers,
            goodPlayersCount,
            evilPlayersCount,
          }),
        });
      }
    }
  });

export type NarrationFormValuesType = z.infer<typeof NarrationFormSchema>;
