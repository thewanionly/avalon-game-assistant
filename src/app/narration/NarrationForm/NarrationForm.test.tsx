import { render, screen } from '@testing-library/react';
import { MIN_PLAYERS, NarrationForm } from './NarrationForm';
import { EVIL_AVALON_CHARACTERS, GOOD_AVALON_CHARACTERS } from '@/constants/characters';

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

  it(`displays Play button`, () => {
    render(<NarrationForm onFormSubmit={jest.fn()} />);

    const playBtn = screen.getByRole('button', { name: /play/i });
    expect(playBtn).toBeInTheDocument();
  });

  it(`displays the number "${MIN_PLAYERS}" in the Play button by default`, () => {
    render(<NarrationForm onFormSubmit={jest.fn()} />);

    const playBtn = screen.getByRole('button', { name: /play/i });
    expect(playBtn).toHaveTextContent(`${MIN_PLAYERS}`);
  });
});
