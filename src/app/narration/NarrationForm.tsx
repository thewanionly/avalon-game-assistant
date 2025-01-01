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
import { BASIC_SCRIPT } from './Narration.constants';

const NUM_OF_PLAYERS_VALUES = ['5', '6', '7', '8', '9', '10'] as const;
const SPECIAL_CHARACTERS_VALUES = ['Percival', 'Mordred', 'Morgana', 'Oberon', 'None'] as const;

const FormSchema = z.object({
  numOfPlayers: z.enum(NUM_OF_PLAYERS_VALUES, {
    required_error: 'You need to select how many players are playing.',
  }),
  specialCharacters: z.enum(SPECIAL_CHARACTERS_VALUES),
});

interface NarrationFormProps {
  onFormSubmit: (narrationScript: string) => void;
}

export const NarrationForm = ({ onFormSubmit }: NarrationFormProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
    return onFormSubmit(BASIC_SCRIPT);
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
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Which of these special characters are included in your game?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap space-y-1"
                >
                  {SPECIAL_CHARACTERS_VALUES.map((value) => (
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
        <Button className="md:self-start" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
