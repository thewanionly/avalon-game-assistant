import { Button } from '@/components/ui/button';
import { useNarrator } from '@/hooks/useNarrator';
import { NarratorStatus } from '@/constants/narrator';

type NarrationPlayerProps = {
  narrationScript: string;
  initialStatus?: NarratorStatus;
  onPlay?: () => void;
  onStop?: () => void;
  onPause?: () => void;
};

export const NarrationPlayer = ({
  narrationScript,
  initialStatus = NarratorStatus.IDLE,
  onPlay,
  onStop,
  onPause,
}: NarrationPlayerProps) => {
  const { status, pause, resume } = useNarrator({ initialStatus });

  const handlePause = () => {
    pause();
    onPause?.();
  };

  const handleResume = () => {
    resume();
  };

  return (
    <>
      <p className="mt-8">{narrationScript}</p>
      <div className="flex flex-wrap gap-4">
        {status === NarratorStatus.IDLE && (
          <Button className="mt-4" onClick={onPlay}>
            Play
          </Button>
        )}
        {[NarratorStatus.PLAYING, NarratorStatus.PAUSED].includes(status) && (
          <>
            <Button className="mt-4" variant="destructive" onClick={onStop}>
              Stop
            </Button>
            <Button
              className="mt-4"
              variant="outline"
              onClick={status === NarratorStatus.PAUSED ? handleResume : handlePause}
            >
              {status === NarratorStatus.PAUSED ? 'Resume' : 'Pause'}
            </Button>
          </>
        )}
      </div>
    </>
  );
};
