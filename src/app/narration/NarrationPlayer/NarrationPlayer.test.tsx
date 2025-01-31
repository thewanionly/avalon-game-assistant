import { render, screen } from '@testing-library/react';
import { NarrationPlayer } from './NarrationPlayer';
import userEvent from '@testing-library/user-event';

const DEFAULT_NARRATION_SCRIPT = 'Everyone, close your eyes';

const setup = () => {
  const narrationScript = DEFAULT_NARRATION_SCRIPT;
  const onStopHandler = jest.fn();
  const onPauseHandler = jest.fn();

  render(
    <NarrationPlayer
      narrationScript={narrationScript}
      onStop={onStopHandler}
      onPause={onPauseHandler}
    />
  );

  return { narrationScript, onStopHandler, onPauseHandler };
};

describe('Narration Player', () => {
  describe('Layout and default state', () => {
    it('displays the narration script', () => {
      setup();

      const narrationScript = screen.getByText(DEFAULT_NARRATION_SCRIPT);
      expect(narrationScript).toBeInTheDocument();
    });

    it('displays "Stop" button', () => {
      setup();

      const stopButton = screen.getByRole('button', { name: /stop/i });
      expect(stopButton).toBeInTheDocument();
    });

    it('displays "Pause" button', () => {
      setup();

      const pauseButton = screen.getByRole('button', { name: /pause/i });
      expect(pauseButton).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('executes the function passed in the `onStop` prop when "Stop" button is clicked', async () => {
      const { onStopHandler } = setup();

      const stopButton = screen.getByRole('button', { name: /stop/i });
      await userEvent.click(stopButton);

      expect(onStopHandler).toHaveBeenCalled();
    });

    it('executes the function passed in the `onPause` prop when "Pause" button is clicked', async () => {
      const { onPauseHandler } = setup();

      const pauseButton = screen.getByRole('button', { name: /pause/i });
      await userEvent.click(pauseButton);

      expect(onPauseHandler).toHaveBeenCalled();
    });
  });
});
