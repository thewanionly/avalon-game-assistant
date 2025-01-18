import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NarrationForm } from './NarrationForm';
import {
  DEFAULT_EVIL_CHARACTERS_VALUE,
  DEFAULT_GOOD_CHARACTERS_VALUE,
  EVIL_AVALON_CHARACTERS,
  GOOD_AVALON_CHARACTERS,
} from '@/constants/characters';

const TOTAL_DEFAULT_CHECKED =
  DEFAULT_GOOD_CHARACTERS_VALUE.length + DEFAULT_EVIL_CHARACTERS_VALUE.length;

describe('NarrationForm', () => {
  describe('Layout and default state', () => {
    it('displays "Good characters" label', () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      const goodCharactersLabel = screen.getByText('Good characters');
      expect(goodCharactersLabel).toBeInTheDocument();
    });

    it('displays "Good characters" description', () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      const goodCharactersDescription = screen.getByText('Merlin should be included.');
      expect(goodCharactersDescription).toBeInTheDocument();
    });

    it(`displays "Good characters" checkboxes with correct labels"`, () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      GOOD_AVALON_CHARACTERS.forEach(({ name }) => {
        const checkbox = screen.getByRole('checkbox', { name });
        expect(checkbox).toBeInTheDocument();
      });
    });

    it(`checks ${DEFAULT_GOOD_CHARACTERS_VALUE} "Good characters" by default`, () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      GOOD_AVALON_CHARACTERS.forEach(({ name }) => {
        const checkbox = screen.getByRole('checkbox', { name });

        if (DEFAULT_GOOD_CHARACTERS_VALUE.includes(name)) {
          expect(checkbox).toBeChecked();
        } else {
          expect(checkbox).not.toBeChecked();
        }
      });
    });

    it('displays "Evil characters" label', () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      const evilCharactersLabel = screen.getByText('Evil characters');
      expect(evilCharactersLabel).toBeInTheDocument();
    });

    it('displays "Evil characters" description', () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      const evilCharactersDescription = screen.getByText('Assassin should be included.');
      expect(evilCharactersDescription).toBeInTheDocument();
    });

    it(`displays "Evil characters" checkboxes with correct labels"`, () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      EVIL_AVALON_CHARACTERS.forEach(({ name }) => {
        const checkbox = screen.getByRole('checkbox', { name });
        expect(checkbox).toBeInTheDocument();
      });
    });

    it(`checks ${DEFAULT_EVIL_CHARACTERS_VALUE.length} "Evil characters" checkboxes by default`, () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      EVIL_AVALON_CHARACTERS.forEach(({ name }) => {
        const checkbox = screen.getByRole('checkbox', { name });

        if (DEFAULT_EVIL_CHARACTERS_VALUE.includes(name)) {
          expect(checkbox).toBeChecked();
        } else {
          expect(checkbox).not.toBeChecked();
        }
      });
    });

    it(`displays Play button`, () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toBeInTheDocument();
    });

    it(`displays the number "${TOTAL_DEFAULT_CHECKED}" in the Play button by default (corresponds to the number of default checked checkboxes)`, () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toHaveTextContent(`${TOTAL_DEFAULT_CHECKED}`);
    });
  });

  describe('Interactions', () => {
    it('checks and unchecks checkboxes', async () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      // checked (default)
      const checkboxEl = screen.getByRole('checkbox', { name: DEFAULT_GOOD_CHARACTERS_VALUE[0] });
      expect(checkboxEl).toBeChecked();

      // unchecked
      await userEvent.click(checkboxEl);
      expect(checkboxEl).not.toBeChecked();

      // checked
      await userEvent.click(checkboxEl);
      expect(checkboxEl).toBeChecked();
    });

    it('increments play button number when a new checkbox is checked', async () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      // default
      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toHaveTextContent(`${TOTAL_DEFAULT_CHECKED}`);

      // check an unchecked checkbox
      const checkboxEl = screen.getByRole('checkbox', { name: EVIL_AVALON_CHARACTERS[0].name });
      expect(checkboxEl).not.toBeChecked();
      await userEvent.click(checkboxEl);

      // assert play button number
      expect(playBtn).toHaveTextContent(`${TOTAL_DEFAULT_CHECKED + 1}`);
    });

    // TODO: not selecting merlin will show an error
    // TODO: not selecting assassin will show an error
    // TODO: selecting less than 5 will throw an error
    // TODO: selecting more than 10 will throw an error
    // TODO: selecting 5 will transition to narrating state
    // TODO: selecting 10 will transition to narrating state
    // TODO: selecting 8 will transition to narrating state
    // TODO: in a 5 player game, good chars should be 3 and evil should be 2
    // TODO: in a 6 player game, good chars should be 4 and evil should be 2
    // TODO: in a 7 player game, good chars should be 4 and evil should be 3
    // TODO: in a 8 player game, good chars should be 5 and evil should be 3
    // TODO: in a 9 player game, good chars should be 6 and evil should be 3
    // TODO: in a 10 player game, good chars should be 6 and evil should be 4
  });
});
