import { Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { useSettingsModalStore } from './SettingsModal.store';

export const SettingsModalButton = () => {
  const openModal = useSettingsModalStore((state) => state.openModal);

  return (
    <Button
      type="button"
      className="[&_svg]:size-6"
      variant="ghost"
      size="icon"
      onClick={openModal}
    >
      <Settings />
      <span className="sr-only">Open settings</span>
    </Button>
  );
};
