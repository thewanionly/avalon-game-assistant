'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AvalonCharacterName,
  DEFAULT_EVIL_CHARACTERS_VALUE,
  DEFAULT_GOOD_CHARACTERS_VALUE,
  EVIL_AVALON_CHARACTERS,
  EVIL_REQUIRED_CHARACTERS,
  GOOD_AVALON_CHARACTERS,
  GOOD_REQUIRED_CHARACTERS,
  TEAM_DISTRIBUTION,
} from '@/constants/characters';
import { cn } from '@/lib/utils';

export const MIN_PLAYERS = 5;
export const MAX_PLAYERS = 10;

const FormSchema = z
  .object({
    goodCharacters: z
      .array(z.string())
      .refine((values) => GOOD_REQUIRED_CHARACTERS.every(({ id }) => values.includes(id)), {
        message: `You must include the following required characters: ${GOOD_REQUIRED_CHARACTERS.map(
          ({ name }) => name
        ).join(', ')}`,
      }),
    evilCharacters: z
      .array(z.string())
      .refine((values) => EVIL_REQUIRED_CHARACTERS.every(({ id }) => values.includes(id)), {
        message: `You must include the following required characters: ${EVIL_REQUIRED_CHARACTERS.map(
          ({ name }) => name
        ).join(', ')}`,
      }),
  })
  .refine(
    ({ goodCharacters, evilCharacters }) => {
      const numberOfPlayers = goodCharacters.length + evilCharacters.length;

      return numberOfPlayers >= MIN_PLAYERS;
    },
    {
      path: [],
      message: `The minimum number of players is ${MIN_PLAYERS}. Please add more players.`,
    }
  )
  .refine(
    ({ goodCharacters, evilCharacters }) => {
      const numberOfPlayers = goodCharacters.length + evilCharacters.length;

      return numberOfPlayers <= MAX_PLAYERS;
    },
    {
      path: [],
      message: `The maximum number of players is ${MAX_PLAYERS}. Please reduce the number of players.`,
    }
  );

type FormValuesType = z.infer<typeof FormSchema>;

interface NarrationFormProps {
  className?: string;
  onFormSubmit: (narrationScript: string) => void;
}

const conditionalString = (condition: boolean, str: string) => (condition ? str : '');

export const NarrationForm = ({ className, onFormSubmit }: NarrationFormProps) => {
  const form = useForm<FormValuesType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      goodCharacters: DEFAULT_GOOD_CHARACTERS_VALUE,
      evilCharacters: DEFAULT_EVIL_CHARACTERS_VALUE,
    },
  });

  // Watching the fields for dynamic state calculation
  const goodChars = useWatch({ control: form.control, name: 'goodCharacters' });
  const evilChars = useWatch({ control: form.control, name: 'evilCharacters' });

  const numberOfPlayers = goodChars.length + evilChars.length;

  const onSubmit = ({ goodCharacters = [], evilCharacters = [] }: FormValuesType) => {
    const { good: goodPlayers, evil: evilPlayers } =
      TEAM_DISTRIBUTION[numberOfPlayers as keyof typeof TEAM_DISTRIBUTION];

    const validDistribution =
      goodCharacters.length === goodPlayers && evilCharacters.length === evilPlayers;

    if (!validDistribution) {
      alert(
        `Oops! It looks like the character selection isn't quite right. In a ${numberOfPlayers}-player game, you need exactly ${goodPlayers} good characters and ${evilPlayers} evil characters to proceed. Please adjust your choices and try again!`
      );
      return;
    }

    const hasPercival = goodCharacters.includes(AvalonCharacterName.Percival);
    const hasMordred = evilCharacters.includes(AvalonCharacterName.Mordred);
    const hasMorgana = evilCharacters.includes(AvalonCharacterName.Morgana);
    const hasOberon = evilCharacters.includes(AvalonCharacterName.Oberon);

    const percivalScript = `
      Merlin ${conditionalString(hasMorgana, `and Morgana`)}, extend your thumb so that Percival may know of you.
      Percival, open your eyes so you may know Merlin ${conditionalString(hasMorgana, `and Morgana`)}.
      Merlin ${conditionalString(hasMorgana, `and Morgana`)}, put your thumbs down and form your hand into a fist.
      Percival, close your eyes.
      All players should have their eyes closed and hands in a fist in front of them.
    `;

    onFormSubmit(`
      Everyone, close your eyes and extend your hand into a fist in front of you.
      Minions of Mordred, ${conditionalString(hasOberon, `not Oberon,`)} open your eyes and look around so that you know all agents of Evil.
      Minions of Mordred, close your eyes.
      All players should have their eyes closed and hands in a fist in front of them.
      Minions of Mordred, ${conditionalString(hasMordred, `not Mordred himself,`)} extend your thumb so that Merlin will know of you.
      Merlin, open your eyes and see the agents of Evil.
      Minions of Mordred, put your thumbs down and re-form your hand into a fist.
      Merlin, close your eyes.
      All players should have their eyes closed and hands in a fist in front of them.
      ${conditionalString(hasPercival, percivalScript)}
      Everyone, open your eyes.
    `);
  };

  // TODO: find a better way to handle global errors with correct typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootError = (form.formState.errors as any)?.['']?.message;

  const hasError = Boolean(rootError || Object.keys(form.formState.errors).length > 0);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col justify-between space-y-6', className)}
      >
        <FormField
          control={form.control}
          name="goodCharacters"
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>Good characters</FormLabel>
              {GOOD_AVALON_CHARACTERS.map(({ id, name, isRequired }, index) => (
                <FormField
                  key={id + index}
                  control={form.control}
                  name="goodCharacters"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={id + index}
                        className="flex flex-wrap items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(id)}
                            onCheckedChange={async (checked) => {
                              if (checked) {
                                field.onChange([...(field.value ?? []), id]);
                              } else {
                                field.onChange(field.value?.filter((v) => v !== id));
                              }

                              await form.trigger(); // Re-run validation
                            }}
                            required={isRequired}
                            aria-label={id}
                          />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            'text-sm font-normal',
                            isRequired && "after:ml-0.5 after:text-red-500 after:content-['*']"
                          )}
                        >
                          {name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage>{form.formState.errors.goodCharacters?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="evilCharacters"
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>Evil characters</FormLabel>
              {EVIL_AVALON_CHARACTERS.map(({ id, name, isRequired }, index) => (
                <FormField
                  key={id + index}
                  control={form.control}
                  name="evilCharacters"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={id + index}
                        className="flex flex-wrap items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(id)}
                            onCheckedChange={async (checked) => {
                              if (checked) {
                                field.onChange([...(field.value ?? []), id]);
                              } else {
                                field.onChange(field.value?.filter((v) => v !== id));
                              }

                              await form.trigger(); // Re-run validation
                            }}
                            required={isRequired}
                            aria-label={id}
                          />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            'text-sm font-normal',
                            isRequired && "after:ml-0.5 after:text-red-500 after:content-['*']"
                          )}
                        >
                          {name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage>{form.formState.errors.evilCharacters?.message}</FormMessage>
            </FormItem>
          )}
        />

        <div>
          <Button className="w-full md:w-max" type="submit" disabled={Boolean(hasError)}>
            Play {numberOfPlayers}
          </Button>
          {rootError && <FormMessage className="mt-2">{rootError}</FormMessage>}
        </div>
      </form>
    </Form>
  );
};
