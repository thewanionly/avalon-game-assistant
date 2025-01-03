'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { CharacterCard } from '@/components/CharacterCard';
import {
  AvalonCharacterName,
  EVIL_AVALON_CHARACTERS,
  GOOD_AVALON_CHARACTERS,
  REQUIRED_CHARACTERS,
} from '@/constants/characters';

const CHARACTERS_VALUES = [...GOOD_AVALON_CHARACTERS, ...EVIL_AVALON_CHARACTERS].map(
  ({ name }) => name
);

const FormSchema = z.object({
  characters: z
    .array(z.string())
    .min(5, 'You must select at least 5 characters.')
    .max(10, 'You cannot select more than 10 characters.')
    .refine((values) => REQUIRED_CHARACTERS.every((item) => values.includes(item)), {
      message: `You must include the following required characters: ${REQUIRED_CHARACTERS.join(', ')}`,
    }),
});

interface NarrationFormProps {
  onFormSubmit: (narrationScript: string) => void;
}

const conditionalString = (condition: boolean, str: string) => (condition ? str : '');

export const NarrationForm = ({ onFormSubmit }: NarrationFormProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      characters: [
        AvalonCharacterName.Merlin,
        `${AvalonCharacterName.LoyalServantOfArthur} 1`,
        `${AvalonCharacterName.LoyalServantOfArthur} 2`,
        AvalonCharacterName.Assassin,
        `${AvalonCharacterName.MinionOfMordred} 1`,
      ],
    },
  });

  const onSubmit = ({ specialCharacters = [] }: z.infer<typeof FormSchema>) => {
    const hasPercival = specialCharacters.includes('Percival');
    const hasMordred = specialCharacters.includes('Mordred');
    const hasMorgana = specialCharacters.includes('Morgana');
    const hasOberon = specialCharacters.includes('Oberon');

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
      <p>Good</p>
      <div className="flex flex-wrap gap-4">
        {GOOD_AVALON_CHARACTERS.map(({ name }, index) => (
          <CharacterCard key={name + index} name={name} />
        ))}
      </div>

      <p>Evil</p>
      <div className="flex flex-wrap gap-4">
        {EVIL_AVALON_CHARACTERS.map(({ name }, index) => (
          <CharacterCard key={name + index} name={name} isEvil />
        ))}
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-between space-y-6"
      >
        <FormField
          control={form.control}
          name="characters"
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>Pick characters</FormLabel>
              <FormDescription>
                Minimum is 5, Maximum is 10. Merlin and Assassin should be included.
              </FormDescription>

              {CHARACTERS_VALUES.map((value, index) => (
                <FormField
                  key={value + index}
                  control={form.control}
                  name="characters"
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
              <FormMessage>{form.formState.errors.characters?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button className="md:self-start" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
