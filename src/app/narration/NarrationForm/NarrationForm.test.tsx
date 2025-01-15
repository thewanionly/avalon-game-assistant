import { render, screen } from '@testing-library/react';
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
