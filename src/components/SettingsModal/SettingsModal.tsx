import { Minus, Plus, Settings, X } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';
import { useSettingsModalStore } from './SettingsModal.store';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { useVoiceSettingsStore } from '@/store/voiceSettingsStore';

export const SettingsModal = () => {
  const isOpen = useSettingsModalStore((state) => state.isOpen);
  const closeModal = useSettingsModalStore((state) => state.closeModal);
  const { rate, setRate, incrementRate, decrementRate } = useVoiceSettingsStore();

  return (
    <Drawer open={isOpen} onOpenChange={closeModal}>
      <DrawerContent className="min-h-[40dvh] p-6 pt-0">
        <DrawerHeader className="flex items-center justify-between px-0 text-left">
          <DrawerTitle className="flex items-center gap-2">
            <Settings /> <span>Settings</span>
          </DrawerTitle>
          {/* Screen-reader-only description */}
          <DrawerDescription className="sr-only">
            Change various app settings here.
          </DrawerDescription>
          <DrawerClose asChild>
            <Button
              type="button"
              className="[&_svg]:size-6"
              variant="ghost"
              size="icon"
              onClick={closeModal}
            >
              <X />
              <span className="sr-only">Close settings</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>
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
              disabled={rate[0] <= 0.1}
            >
              <Minus />
              <span className="sr-only">Decrement rate by 0.1</span>
            </Button>
            <Slider value={rate} onValueChange={setRate} max={2} min={0.1} step={0.1} />
            <Button
              type="button"
              className="rounded-full p-2 [&_svg]:size-6"
              variant="secondary"
              size="icon"
              onClick={incrementRate}
              disabled={rate[0] >= 2}
            >
              <Plus />
              <span className="sr-only">Increment rate by 0.1</span>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
