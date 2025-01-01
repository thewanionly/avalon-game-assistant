'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const NUM_OF_PLAYERS_VALUES = ['5', '6', '7', '8', '9', '10'] as const;
const SPECIAL_CHARACTERS_VALUES = ['Percival', 'Mordred', 'Morgana', 'Oberon'] as const;

const FormSchema = z.object({
  numOfPlayers: z.enum(NUM_OF_PLAYERS_VALUES, {
    required_error: 'You need to select how many players are playing.',
  }),
  specialCharacters: z.array(z.string()).optional(),
});

interface NarrationFormProps {
  onFormSubmit: (narrationScript: string) => void;
}

const conditionalString = (condition: boolean, str: string) => (condition ? str : '');

export const NarrationForm = ({ onFormSubmit }: NarrationFormProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      numOfPlayers: '5',
      specialCharacters: [],
    },
  });

  function onSubmit({ specialCharacters = [] }: z.infer<typeof FormSchema>) {
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
      Everyone close your eyes and extend your hand into a fist in front of you.
      Minions of Mordred, ${conditionalString(hasOberon, `not Oberon,`)} open your eyes and look around so that you know all agents of Evil.
      Minions of Mordred close your eyes.
      All players should have their eyes closed and hands in a fist in front of them.
      Minions of Mordred, ${conditionalString(hasMordred, `not Mordred himself,`)} extend your thumb so that Merlin will know of you.
      Merlin, open your eyes and see the agents of .
      Minions of Mordred, put your thumbs down and re-form your hand into a fist.
      Merlin, close your eyes.
      All players should have their eyes closed and hands in a fist in front of them.
      ${conditionalString(hasPercival, percivalScript)}
      Everyone open your eyes.
    `);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-between space-y-6"
      >
        <FormField
          control={form.control}
          name="numOfPlayers"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select number of players</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap space-y-1"
                >
                  {NUM_OF_PLAYERS_VALUES.map((value) => (
                    <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={value} />
                      </FormControl>
                      <FormLabel className="font-normal">{value}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialCharacters"
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>Which of these special characters are included in your game?</FormLabel>

              {SPECIAL_CHARACTERS_VALUES.map((value) => (
                <FormField
                  key={value}
                  control={form.control}
                  name="specialCharacters"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={value}
                        className="flex flex-row items-start space-x-3 space-y-0"
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
              <FormMessage />
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
