import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { CheckboxProps } from '@radix-ui/react-checkbox';

type NarrationCheckboxProps = {
  label: string;
  isChecked: boolean;
  onCheckedChange: CheckboxProps['onCheckedChange'];
  uniqueLabel: string;
  isRequired?: boolean;
  className?: string;
};

export const NarrationCheckbox = ({
  label,
  isChecked,
  onCheckedChange,
  uniqueLabel,
  isRequired = false,
  className,
}: NarrationCheckboxProps) => {
  return (
    <FormItem className={cn('flex items-center gap-2 space-y-0', className)}>
      <FormControl>
        <Checkbox
          checked={isChecked}
          onCheckedChange={onCheckedChange}
          required={isRequired}
          aria-label={uniqueLabel}
        />
      </FormControl>
      <FormLabel
        className={cn(
          'text-sm font-normal',
          isRequired && "after:ml-0.5 after:text-red-500 after:content-['*']"
        )}
      >
        {label}
      </FormLabel>
    </FormItem>
  );
};
