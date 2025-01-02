import { cn } from '@/lib/utils';

interface CharacterCardProps {
  name: string;
  isEvil?: boolean;
}

export const CharacterCard = ({ name, isEvil = false }: CharacterCardProps) => {
  return (
    <div
      className={cn(
        'flex h-[200px] w-[130px] items-center justify-center rounded-md text-center',
        isEvil ? 'bg-red-500 p-4 text-slate-50' : 'bg-blue-500 p-4 text-neutral-900'
      )}
    >
      {name}
    </div>
  );
};
