'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  AVALON_CHARACTERS,
  AvalonCharacterName,
  EVIL_AVALON_CHARACTERS,
  EVIL_REQUIRED_CHARACTERS,
  GOOD_AVALON_CHARACTERS,
  GOOD_REQUIRED_CHARACTERS,
  TEAM_DISTRIBUTION,
} from '@/constants/characters';
import { cn } from '@/lib/utils';
import { NarrationCheckbox } from './NarrationCheckbox';
import { dynamicString } from '@/utils/dynamicString';
import {
  ERROR_CHARACTER_DISTRIBUTION,
  ERROR_MAX_PLAYERS,
  ERROR_MIN_PLAYERS,
  ERROR_REQUIRED_CHARACTERS,
} from '@/constants/errorMessages';
import {
  EVIL_CHARACTERS_LABEL,
  EVIL_CHARACTERS_NO_SELECTED_LABEL,
  GOOD_CHARACTERS_LABEL,
  GOOD_CHARACTERS_NO_SELECTED_LABEL,
  PLAY_BUTTON_LABEL,
  PLAY_BUTTON_NO_SELECTED_LABEL,
} from '@/constants/labels';
import { generateNarrationScript } from '@/helper/generateNarrationScript';

export const MIN_PLAYERS = 5;
export const MAX_PLAYERS = 10;

const FormSchema = z
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

type FormValuesType = z.infer<typeof FormSchema>;

interface NarrationFormProps {
  className?: string;
  defaultValues?: FormValuesType;
  onFormSubmit: (narrationScript: string) => void;
}

export const NarrationForm = ({ className, defaultValues, onFormSubmit }: NarrationFormProps) => {
  const form = useForm<FormValuesType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      goodCharacters: [],
      evilCharacters: [],
      ...defaultValues,
    },
  });

  // Watching the fields for dynamic state calculation
  const goodChars = useWatch({ control: form.control, name: 'goodCharacters' });
  const evilChars = useWatch({ control: form.control, name: 'evilCharacters' });

  const numberOfPlayers = goodChars.length + evilChars.length;

  const onSubmit = ({ goodCharacters = [], evilCharacters = [] }: FormValuesType) => {
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

    onFormSubmit(generateNarrationScript({ hasMordred, hasMorgana, hasOberon, hasPercival }));
  };

  // TODO: find a better way to handle global errors with correct typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootError = (form.formState.errors as any)?.['']?.message;

  const hasError = Boolean(rootError || Object.keys(form.formState.errors).length > 0);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col justify-between gap-6', className)}
      >
        {/* Good characters */}
        <FormField
          control={form.control}
          name="goodCharacters"
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>
                {dynamicString(
                  goodChars.length > 0 ? GOOD_CHARACTERS_LABEL : GOOD_CHARACTERS_NO_SELECTED_LABEL,
                  { count: goodChars.length }
                )}
              </FormLabel>
              {GOOD_AVALON_CHARACTERS.map(({ id, name, uniqueLabel, isRequired }) => (
                <FormField
                  key={id}
                  control={form.control}
                  name="goodCharacters"
                  render={({ field }) => (
                    <NarrationCheckbox
                      label={name}
                      uniqueLabel={uniqueLabel}
                      isRequired={isRequired}
                      isChecked={field.value?.includes(id)}
                      onCheckedChange={async (checked) => {
                        const newValue = checked
                          ? [...(field.value ?? []), id]
                          : field.value?.filter((v) => v !== id);

                        field.onChange(newValue); // save new value
                        await form.trigger(); // Re-run validation
                      }}
                    />
                  )}
                />
              ))}
              <FormMessage>{form.formState.errors.goodCharacters?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Evil characters */}
        <FormField
          control={form.control}
          name="evilCharacters"
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>
                {dynamicString(
                  evilChars.length > 0 ? EVIL_CHARACTERS_LABEL : EVIL_CHARACTERS_NO_SELECTED_LABEL,
                  { count: evilChars.length }
                )}
              </FormLabel>
              {EVIL_AVALON_CHARACTERS.map(({ id, name, uniqueLabel, isRequired }) => (
                <FormField
                  key={id}
                  control={form.control}
                  name="evilCharacters"
                  render={({ field }) => (
                    <NarrationCheckbox
                      label={name}
                      uniqueLabel={uniqueLabel}
                      isRequired={isRequired}
                      isChecked={field.value?.includes(id)}
                      onCheckedChange={async (checked) => {
                        const newValue = checked
                          ? [...(field.value ?? []), id]
                          : field.value?.filter((v) => v !== id);

                        field.onChange(newValue); // save new value
                        await form.trigger(); // Re-run validation
                      }}
                    />
                  )}
                />
              ))}
              <FormMessage>{form.formState.errors.evilCharacters?.message}</FormMessage>
            </FormItem>
          )}
        />

        <div>
          <Button className="w-full md:w-max" type="submit" disabled={Boolean(hasError)}>
            {dynamicString(
              numberOfPlayers > 0 ? PLAY_BUTTON_LABEL : PLAY_BUTTON_NO_SELECTED_LABEL,
              { count: numberOfPlayers }
            )}
          </Button>
          {rootError && <FormMessage className="mt-2">{rootError}</FormMessage>}
        </div>
      </form>
    </Form>
  );
};
