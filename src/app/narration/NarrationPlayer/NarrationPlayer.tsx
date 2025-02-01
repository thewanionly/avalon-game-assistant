import { Button } from '@/components/ui/button';
import { useState } from 'react';

export enum NarrationPlayerStatus {
  IDLE = 'idle',
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped',
}

type NarrationPlayerProps = {
  narrationScript: string;
  initialStatus?: NarrationPlayerStatus;
  onPlay?: () => void;
  onStop?: () => void;
  onPause?: () => void;
};

export const NarrationPlayer = ({
  narrationScript,
  initialStatus = NarrationPlayerStatus.IDLE,
  onPlay,
  onStop,
  onPause,
}: NarrationPlayerProps) => {
  const [status, setStatus] = useState<NarrationPlayerStatus>(initialStatus);

  const handlePause = () => {
    setStatus(
      status === NarrationPlayerStatus.PAUSED
        ? NarrationPlayerStatus.PLAYING
        : NarrationPlayerStatus.PAUSED
    );

    onPause?.();
  };

  return (
    <>
      <p className="mt-8">{narrationScript}</p>
      <div className="flex flex-wrap gap-4">
        {status === NarrationPlayerStatus.IDLE && (
          <Button className="mt-4" onClick={onPlay}>
            Play
          </Button>
        )}
        {[NarrationPlayerStatus.PLAYING, NarrationPlayerStatus.PAUSED].includes(status) && (
          <>
            <Button className="mt-4" variant="destructive" onClick={onStop}>
              Stop
            </Button>
            <Button className="mt-4" variant="outline" onClick={handlePause}>
              {status === NarrationPlayerStatus.PAUSED ? 'Resume' : 'Pause'}
            </Button>
          </>
        )}
      </div>
    </>
  );
};
