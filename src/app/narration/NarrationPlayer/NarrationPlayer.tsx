import { Button } from '@/components/ui/button';
import { useNarrator } from '@/hooks/useNarrator';
import { NarratorStatus } from '@/constants/narrator';
import { useEffect } from 'react';

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
  const { status, speak, pause, resume, stop } = useNarrator({ initialStatus });

  const handlePause = () => {
    pause();
    onPause?.();
  };

  const handleResume = () => {
    resume();
  };

  const handleReplay = () => {
    speak(narrationScript);
  };

  const handleUpdateSelection = () => {
    onStop?.();
  };

  useEffect(() => {
    if (initialStatus !== NarratorStatus.PLAYING) return;

    // start narrator if initialStatus is playing
    speak(narrationScript);

    const handleBeforeUnload = () => {
      // stop narrator during page reload
      stop(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // stop narrator in the next time this useEffect is run (e.g. component unmounts)
      stop();
    };
  }, [initialStatus, narrationScript, speak, stop]);

  return (
    <>
      <p className="mt-8">{narrationScript}</p>
      <div className="mt-4 flex flex-wrap gap-4">
        {status === NarratorStatus.IDLE && <Button onClick={onPlay}>Play</Button>}
        {[NarratorStatus.PLAYING, NarratorStatus.PAUSED].includes(status) && (
          <>
            <Button variant="destructive" onClick={onStop}>
              Stop
            </Button>
            <Button
              variant="outline"
              onClick={status === NarratorStatus.PAUSED ? handleResume : handlePause}
            >
              {status === NarratorStatus.PAUSED ? 'Resume' : 'Pause'}
            </Button>
          </>
        )}
        {status === NarratorStatus.END && (
          <>
            <Button onClick={handleReplay}>Replay</Button>
            <Button variant="outline" onClick={handleUpdateSelection}>
              Update selection
            </Button>
          </>
        )}
      </div>
    </>
  );
};
