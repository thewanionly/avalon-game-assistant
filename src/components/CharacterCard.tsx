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
        'flex aspect-[3/4] min-w-[82px] items-center justify-center rounded-md p-4 text-center text-sm',
        isEvil && (isSelected ? 'bg-red-500 text-slate-50' : 'bg-red-500/50 text-slate-50/50'),
        !isEvil &&
          (isSelected ? 'bg-blue-500 text-neutral-900' : 'bg-blue-500/50 text-neutral-900/50'),
        classsName
      )}
    >
      {name}
    </div>
  );
};
