import { render, screen } from '@testing-library/react';
import { NarrationPlayer } from './NarrationPlayer';
import userEvent from '@testing-library/user-event';
import { NarratorStatus } from '@/constants/narrator';

const DEFAULT_NARRATION_SCRIPT = 'Everyone, close your eyes';

const setup = (initialStatus = NarratorStatus.PLAYING) => {
  const narrationScript = DEFAULT_NARRATION_SCRIPT;
  const onCloseHandler = jest.fn();

  render(
    <NarrationPlayer
      narrationScript={narrationScript}
      initialStatus={initialStatus}
      onClose={onCloseHandler}
    />
  );

  return { narrationScript, onCloseHandler };
};

describe('Narration Player', () => {
  describe('Layout and default state', () => {
    it('displays the narration script', () => {
      setup();

      const narrationScript = screen.getByText(DEFAULT_NARRATION_SCRIPT);
      expect(narrationScript).toBeInTheDocument();
    });

    it('displays "Play" button when initial status is idle', () => {
      setup(NarratorStatus.IDLE);

      const playButton = screen.getByRole('button', { name: /play/i });
      expect(playButton).toBeInTheDocument();
    });

    it('hides "Stop" button when initial status is idle', () => {
      setup(NarratorStatus.IDLE);

      const stopButton = screen.queryByRole('button', { name: /stop/i });
      expect(stopButton).not.toBeInTheDocument();
    });

    it('hides "Pause" button when initial status is idle', () => {
      setup(NarratorStatus.IDLE);

      const pauseButton = screen.queryByRole('button', { name: /pause/i });
      expect(pauseButton).not.toBeInTheDocument();
    });

    it('hides "Play" button when initial status is playing', () => {
      setup();

      const playButton = screen.queryByRole('button', { name: /play/i });
      expect(playButton).not.toBeInTheDocument();
    });

    it('displays "Stop" button when initial status is playing', () => {
      setup();

      const stopButton = screen.getByRole('button', { name: /stop/i });
      expect(stopButton).toBeInTheDocument();
    });

    it('displays "Pause" button when initial status is playing', () => {
      setup();

      const pauseButton = screen.getByRole('button', { name: /pause/i });
      expect(pauseButton).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('executes the function passed in the `onClose` prop when "Stop" button is clicked', async () => {
      const { onCloseHandler } = setup();

      const stopButton = screen.getByRole('button', { name: /stop/i });
      await userEvent.click(stopButton);

      expect(onCloseHandler).toHaveBeenCalled();
    });

    it('shows the "Resume" button and hides the "Pause" button when "Pause" button is clicked', async () => {
      setup();

      const pauseButton1 = screen.getByRole('button', { name: /pause/i });
      await userEvent.click(pauseButton1);

      const resumeButton = screen.getByRole('button', { name: /resume/i });
      expect(resumeButton).toBeInTheDocument();

      const pauseButton2 = screen.queryByRole('button', { name: /pause/i });
      expect(pauseButton2).not.toBeInTheDocument();
    });

    it('shows the "Pause" button and hides the "Resume" button when "Resume" button is clicked', async () => {
      setup();

      const pauseButton1 = screen.getByRole('button', { name: /pause/i });
      await userEvent.click(pauseButton1);

      const resumeButton1 = screen.getByRole('button', { name: /resume/i });
      await userEvent.click(resumeButton1);

      const pauseButton2 = screen.getByRole('button', { name: /pause/i });
      expect(pauseButton2).toBeInTheDocument();

      const resumeButton2 = screen.queryByRole('button', { name: /resume/i });
      expect(resumeButton2).not.toBeInTheDocument();
    });
  });
});
