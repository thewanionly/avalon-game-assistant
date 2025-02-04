import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { NarrationArea } from './NarrationArea';
import {
  EVIL_CHARACTERS_NO_SELECTED_LABEL,
  GOOD_CHARACTERS_NO_SELECTED_LABEL,
} from '@/constants/labels';
import { DEFAULT_GOOD_CHARACTERS } from '@/constants/characters';

const setup = () => {
  render(<NarrationArea />);
};

describe('Narration Area', () => {
  describe('Layout and default state', () => {
    it('displays the narration form', () => {
      setup();

      // assert if "Good characters" field is present
      const goodCharactersLabel = screen.getByText(
        new RegExp(GOOD_CHARACTERS_NO_SELECTED_LABEL, 'i')
      );
      expect(goodCharactersLabel).toBeInTheDocument();

      // assert if "Evil characters" field is present
      const evilCharactersLabel = screen.getByText(
        new RegExp(EVIL_CHARACTERS_NO_SELECTED_LABEL, 'i')
      );
      expect(evilCharactersLabel).toBeInTheDocument();

      // assert submit button is present
      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('displays the narration player when "Play" button is clicked', async () => {
      setup();

      const playBtn = screen.getByRole('button', { name: /play/i });
      await userEvent.click(playBtn);

      // assert narration player is present
      const stopBtn = screen.getByRole('button', { name: /stop/i });
      expect(stopBtn).toBeInTheDocument();

      const pauseBtn = screen.getByRole('button', { name: /pause/i });
      expect(pauseBtn).toBeInTheDocument();
    });

    it('does not display the narration player when "Play" button is clicked and form is invalid', async () => {
      setup();

      // arrange - make the form invalid by violating min players rule
      const checkboxEl = screen.getByRole('checkbox', {
        name: DEFAULT_GOOD_CHARACTERS[0].uniqueLabel,
      });
      await userEvent.click(checkboxEl);

      const playBtn = screen.getByRole('button', { name: /play/i });
      await userEvent.click(playBtn);

      // assert narration player is NOT present
      const stopBtn = screen.queryByRole('button', { name: /stop/i });
      expect(stopBtn).not.toBeInTheDocument();

      const pauseBtn = screen.queryByRole('button', { name: /pause/i });
      expect(pauseBtn).not.toBeInTheDocument();
    });

    it('displays back the narration form after clicking "Stop" button in narration player', async () => {
      setup();

      // transition to Narration Player
      const playBtn = screen.getByRole('button', { name: /play/i });
      await userEvent.click(playBtn);

      // click stop button
      const stopBtn = screen.getByRole('button', { name: /stop/i });
      await userEvent.click(stopBtn);

      // assert narration form elements are present

      const goodCharactersLabel = screen.getByText(
        new RegExp(GOOD_CHARACTERS_NO_SELECTED_LABEL, 'i')
      );
      expect(goodCharactersLabel).toBeInTheDocument();

      const evilCharactersLabel = screen.getByText(
        new RegExp(EVIL_CHARACTERS_NO_SELECTED_LABEL, 'i')
      );
      expect(evilCharactersLabel).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    });
  });
});
