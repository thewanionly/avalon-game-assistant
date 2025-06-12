import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useVoiceSettingsStore } from '@/store/voiceSettingsStore';

const MAX_RATE = 2;
const MIN_RATE = 0.1;
const RATE_STEP = 0.1;

export const RateControl = () => {
  const { rate, setRate, incrementRate, decrementRate } = useVoiceSettingsStore();

  return (
    <div className="mt-8">
      <div className="mb-4 flex justify-between">
        <Label>Speed</Label>
        <span className="text-sm">{rate[0].toFixed(2)}</span>
      </div>
      <div className="flex justify-between gap-3">
        <Button
          type="button"
          className="rounded-full p-2 [&_svg]:size-6"
          variant="secondary"
          size="icon"
          onClick={decrementRate}
          disabled={rate[0] <= MIN_RATE}
        >
          <Minus />
          <span className="sr-only">Decrement rate by {RATE_STEP}</span>
        </Button>
        <Slider
          value={rate}
          onValueChange={setRate}
          max={MAX_RATE}
          min={MIN_RATE}
          step={RATE_STEP}
        />
        <Button
          type="button"
          className="rounded-full p-2 [&_svg]:size-6"
          variant="secondary"
          size="icon"
          onClick={incrementRate}
          disabled={rate[0] >= MAX_RATE}
        >
          <Plus />
          <span className="sr-only">Increment rate by {RATE_STEP}</span>
        </Button>
      </div>
    </div>
  );
};
