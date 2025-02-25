import { CharacterCard } from '@/components/CharacterCard';
import { FormControl, FormItem } from '@/components/ui/form';

import { cn } from '@/lib/utils';
import { CheckboxProps } from '@radix-ui/react-checkbox';
import { ChangeEvent } from 'react';

type NarrationCheckboxProps = {
  label: string;
  isChecked: boolean;
  onCheckedChange: CheckboxProps['onCheckedChange'];
  uniqueLabel: string;
  isRequired?: boolean;
  className?: string;
  isEvil?: boolean;
};

export const NarrationCheckbox = ({
  label,
  isChecked,
  onCheckedChange,
  uniqueLabel,
  isRequired = false,
  className,
  isEvil,
}: NarrationCheckboxProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
  };

  return (
    <FormItem className={cn('flex items-center gap-2 space-y-0', className)}>
      <label>
        <FormControl>
          <input
            className="peer absolute m-0 appearance-none"
            type="checkbox"
            aria-checked={isChecked}
            checked={isChecked}
            onChange={handleChange}
            aria-label={uniqueLabel}
            required={isRequired}
          />
        </FormControl>
        <CharacterCard
          classsName={cn(
            'peer-focus:outline peer-focus:outline-2 peer-focus:outline-offset-2 peer-focus:outline-gray-500 peer-focus:ring-2 peer-focus:ring-gray-300'
          )}
          name={isRequired ? `${label} *` : label}
          isEvil={isEvil}
          isSelected={isChecked}
        />
        <span
          className={cn(
            'sr-only text-sm font-normal',
            isRequired && "after:ml-0.5 after:text-red-500 after:content-['*']"
          )}
        >
          {label}
        </span>
      </label>
    </FormItem>
  );
};
