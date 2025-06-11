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

export const SettingsModal = () => {
  const isOpen = useSettingsModalStore((state) => state.isOpen);
  const closeModal = useSettingsModalStore((state) => state.closeModal);

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
      </DrawerContent>
    </Drawer>
  );
};
