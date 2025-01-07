'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AvalonCharacterLoyalty,
  AvalonCharacterName,
  EVIL_AVALON_CHARACTERS,
  GOOD_AVALON_CHARACTERS,
  REQUIRED_CHARACTERS,
} from '@/constants/characters';

const MIN_PLAYERS = 5;
const MAX_PLAYERS = 10;

const FormSchema = z.object({
  goodCharacters: z
    .array(z.string())
    .refine(
      (values) =>
        REQUIRED_CHARACTERS.filter(({ loyalty }) => loyalty === AvalonCharacterLoyalty.Good).every(
          ({ name }) => values.includes(name)
        ),
      {
        message: `You must include the following required characters: ${REQUIRED_CHARACTERS.filter(
          ({ loyalty }) => loyalty === AvalonCharacterLoyalty.Good
        )
          .map(({ name }) => name)
          .join(', ')}`,
      }
    ),
  evilCharacters: z
    .array(z.string())
    .refine(
      (values) =>
        REQUIRED_CHARACTERS.filter(({ loyalty }) => loyalty === AvalonCharacterLoyalty.Evil).every(
          ({ name }) => values.includes(name)
        ),
      {
        message: `You must include the following required characters: ${REQUIRED_CHARACTERS.filter(
          ({ loyalty }) => loyalty === AvalonCharacterLoyalty.Evil
        )
          .map(({ name }) => name)
          .join(', ')}`,
      }
    ),
});

interface NarrationFormProps {
  onFormSubmit: (narrationScript: string) => void;
}

const conditionalString = (condition: boolean, str: string) => (condition ? str : '');

export const NarrationForm = ({ onFormSubmit }: NarrationFormProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      goodCharacters: [
        AvalonCharacterName.Merlin,
        `${AvalonCharacterName.LoyalServantOfArthur} 1`,
        `${AvalonCharacterName.LoyalServantOfArthur} 2`,
      ],
      evilCharacters: [AvalonCharacterName.Assassin, `${AvalonCharacterName.MinionOfMordred} 1`],
    },
  });

  // Watching the fields for dynamic state calculation
  const goodChars = useWatch({ control: form.control, name: 'goodCharacters' });
  const evilChars = useWatch({ control: form.control, name: 'evilCharacters' });

  const numberOfPlayers = goodChars.length + evilChars.length;

  const onSubmit = ({ goodCharacters = [], evilCharacters = [] }: z.infer<typeof FormSchema>) => {
    if (numberOfPlayers < MIN_PLAYERS) {
      alert(`The minimum number of players is ${MIN_PLAYERS}. Please pick add more players.`);
      return;
    }

    if (numberOfPlayers > MAX_PLAYERS) {
      alert(
        `The maximum number of players is ${MAX_PLAYERS}. Please reduce the number of players.`
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-between space-y-6"
      >
        <FormField
          control={form.control}
          name="goodCharacters"
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>Good characters</FormLabel>
              <FormDescription>Merlin should be included.</FormDescription>
              {GOOD_AVALON_CHARACTERS.map(({ name }) => name).map((value, index) => (
                <FormField
                  key={value + index}
                  control={form.control}
                  name="goodCharacters"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={value + index}
                        className="flex flex-wrap items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value ?? []), value])
                                : field.onChange(field.value?.filter((v) => v !== value));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">{value}</FormLabel>
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
              <FormDescription>Assassin should be included.</FormDescription>
              {EVIL_AVALON_CHARACTERS.map(({ name }) => name).map((value, index) => (
                <FormField
                  key={value + index}
                  control={form.control}
                  name="evilCharacters"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={value + index}
                        className="flex flex-wrap items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value ?? []), value])
                                : field.onChange(field.value?.filter((v) => v !== value));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">{value}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage>{form.formState.errors.evilCharacters?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button className="md:self-start" type="submit">
          Play {numberOfPlayers}
        </Button>
        {form.formState.isDirty && (
          <Button variant="secondary" className="md:self-start" onClick={() => form.reset()}>
            Reset
          </Button>
        )}
      </form>
    </Form>
  );
};
