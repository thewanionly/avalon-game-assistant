import { Button } from '@/components/ui/button';
import { useNarrator } from '@/hooks/useNarrator';
import { NarratorStatus } from '@/constants/narrator';
import { transformNarrationScript } from './NarrationPlayer.utils';

type NarrationPlayerProps = {
  narrationScript: string;
  initialStatus?: NarratorStatus;
  onClose: () => void;
};

export const NarrationPlayer = ({
  narrationScript,
  initialStatus = NarratorStatus.IDLE,
  onClose,
}: NarrationPlayerProps) => {
  const { status, speak, stop, pause, resume } = useNarrator({
    text: narrationScript,
    initialStatus,
  });

  const handlePlay = () => {
    speak();
  };

  const handleStop = () => {
    stop();
    onClose();
  };

  const handlePause = () => {
    pause();
  };

  const handleResume = () => {
    resume();
  };

  const handleUpdateSelection = () => {
    onClose();
  };

  return (
    <>
      <ol className="mt-8 flex flex-col gap-2">
        {transformNarrationScript(narrationScript).map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-4">
        {status === NarratorStatus.IDLE && <Button onClick={handlePlay}>Play</Button>}
        {[NarratorStatus.PLAYING, NarratorStatus.PAUSED].includes(status) && (
          <>
            <Button variant="destructive" onClick={handleStop}>
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
            <Button onClick={handlePlay}>Replay</Button>
            <Button variant="outline" onClick={handleUpdateSelection}>
              Update selection
            </Button>
          </>
        )}
      </div>
    </>
  );
};
