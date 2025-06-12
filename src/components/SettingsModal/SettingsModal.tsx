import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';
import { useSettingsModalStore } from './SettingsModal.store';
import { RateControl } from './RateControl';

export const SettingsModal = () => {
  const isOpen = useSettingsModalStore((state) => state.isOpen);
  const closeModal = useSettingsModalStore((state) => state.closeModal);

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
        <RateControl />
      </DrawerContent>
    </Drawer>
  );
};
