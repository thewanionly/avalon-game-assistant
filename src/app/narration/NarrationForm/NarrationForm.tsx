import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { EVIL_AVALON_CHARACTERS, GOOD_AVALON_CHARACTERS } from '@/constants/characters';
import { cn } from '@/lib/utils';
import { NarrationCheckbox } from './NarrationCheckbox';
import { dynamicString } from '@/utils/dynamicString';

import {
  EVIL_CHARACTERS_LABEL,
  EVIL_CHARACTERS_NO_SELECTED_LABEL,
  GOOD_CHARACTERS_LABEL,
  GOOD_CHARACTERS_NO_SELECTED_LABEL,
  PLAY_BUTTON_LABEL,
  PLAY_BUTTON_NO_SELECTED_LABEL,
} from '@/constants/labels';
import { NarrationFormSchema, NarrationFormValuesType } from './NarrationForm.schema';

interface NarrationFormProps {
  className?: string;
  defaultValues?: NarrationFormValuesType;
  onFormSubmit: (values: NarrationFormValuesType) => void;
}

export const NarrationForm = ({
  className,
  defaultValues = { goodCharacters: [], evilCharacters: [] },
  onFormSubmit,
}: NarrationFormProps) => {
  const form = useForm<NarrationFormValuesType>({
    resolver: zodResolver(NarrationFormSchema),
    defaultValues,
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    trigger,
  } = form;

  // Watching the fields for dynamic state calculation
  const goodChars = useWatch({ control, name: 'goodCharacters' });
  const evilChars = useWatch({ control, name: 'evilCharacters' });

  const numberOfPlayers = goodChars.length + evilChars.length;

  // TODO: find a better way to handle global errors with correct typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootError = (errors as any)?.['']?.message;

  const hasError = Boolean(rootError || Object.keys(errors).length > 0);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={cn('flex flex-col justify-between gap-6', className)}
      >
        {/* Good characters */}
        <FormField
          control={control}
          name="goodCharacters"
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>
                {dynamicString(
                  goodChars.length > 0 ? GOOD_CHARACTERS_LABEL : GOOD_CHARACTERS_NO_SELECTED_LABEL,
                  { count: goodChars.length }
                )}
              </FormLabel>
              <div className="grid grid-cols-[repeat(auto-fit,_minmax(120px,_1fr))] gap-1">
                {GOOD_AVALON_CHARACTERS.map(({ id, name, uniqueLabel, isRequired }) => (
                  <FormField
                    key={id}
                    control={control}
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
                          await trigger(); // Re-run validation
                        }}
                      />
                    )}
                  />
                ))}
              </div>
              <FormMessage>{errors.goodCharacters?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Evil characters */}
        <FormField
          control={control}
          name="evilCharacters"
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>
                {dynamicString(
                  evilChars.length > 0 ? EVIL_CHARACTERS_LABEL : EVIL_CHARACTERS_NO_SELECTED_LABEL,
                  { count: evilChars.length }
                )}
              </FormLabel>
              <div className="grid grid-cols-[repeat(auto-fit,_minmax(120px,_1fr))] gap-1">
                {EVIL_AVALON_CHARACTERS.map(({ id, name, uniqueLabel, isRequired }) => (
                  <FormField
                    key={id}
                    control={control}
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
                          await trigger(); // Re-run validation
                        }}
                        isEvil
                      />
                    )}
                  />
                ))}
              </div>
              <FormMessage>{errors.evilCharacters?.message}</FormMessage>
            </FormItem>
          )}
        />

        <div className="sticky bottom-0 bg-white pb-5 pt-7">
          <Button className="w-full" type="submit" disabled={Boolean(hasError)}>
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
