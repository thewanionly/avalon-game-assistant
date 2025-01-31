'use client';

import { Button } from '@/components/ui/button';

type NarrationPlayerProps = {
  narrationScript: string;
  onStop: () => void;
  onPause: () => void;
};

export const NarrationPlayer = ({ narrationScript, onStop, onPause }: NarrationPlayerProps) => {
  return (
    <>
      <p className="mt-8">{narrationScript}</p>
      <div className="flex flex-wrap gap-4">
        <Button className="mt-4" variant="destructive" onClick={onStop}>
          Stop
        </Button>
        <Button className="mt-4" variant="outline" onClick={onPause}>
          Pause
        </Button>
      </div>
    </>
  );
};
