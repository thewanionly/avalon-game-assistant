import { cn } from '@/lib/utils';

interface CharacterCardProps {
  name: string;
  classsName?: string;
  isEvil?: boolean;
  isSelected?: boolean;
}

export const CharacterCard = ({
  name,
  classsName,
  isEvil = false,
  isSelected = false,
}: CharacterCardProps) => {
  return (
    <div
      className={cn(
        'flex aspect-[3/4] w-[82px] items-center justify-center rounded-md border bg-background p-4 text-center text-sm',
        isEvil &&
          (isSelected ? 'border-red-500 text-red-500' : 'border-primary/80 text-primary/80'),
        !isEvil &&
          (isSelected ? 'border-blue-500 text-blue-500' : 'border-primary/80 text-primary/80'),
        classsName
      )}
    >
      {name}
    </div>
  );
};
