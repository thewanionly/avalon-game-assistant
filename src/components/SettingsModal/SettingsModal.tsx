import { X } from 'lucide-react';
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
  const { rate, setRate } = useVoiceSettingsStore();

  return (
    <Drawer open={isOpen} onOpenChange={closeModal}>
      <DrawerContent className="min-h-[80dvh]">
        <DrawerHeader className="flex items-center justify-between text-left">
          <DrawerTitle>Settings</DrawerTitle>
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
        <div className="mt-4 p-4">
          <div className="mb-4 flex justify-between">
            <Label>Speed</Label>
            <span className="text-sm text-gray-500">{rate[0].toFixed(2)}</span>
          </div>
          <Slider value={rate} onValueChange={setRate} max={2} min={0.25} step={0.25} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
