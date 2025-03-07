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
      <ol className="flex flex-col gap-5">
        {transformNarrationScript(narrationScript).map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ol>
      <div className="sticky bottom-0 mt-8 flex flex-wrap gap-4 bg-background pb-5 pt-5">
        {status === NarratorStatus.IDLE && <Button onClick={handlePlay}>Play</Button>}
        {[NarratorStatus.PLAYING, NarratorStatus.PAUSED].includes(status) && (
          <>
            <Button className="flex-1" variant="destructive" onClick={handleStop}>
              Stop
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={status === NarratorStatus.PAUSED ? handleResume : handlePause}
            >
              {status === NarratorStatus.PAUSED ? 'Resume' : 'Pause'}
            </Button>
          </>
        )}
        {status === NarratorStatus.END && (
          <>
            <Button className="flex-1" onClick={handlePlay}>
              Replay
            </Button>
            <Button className="flex-1" variant="outline" onClick={handleUpdateSelection}>
              Update selection
            </Button>
          </>
        )}
      </div>
    </>
  );
};
