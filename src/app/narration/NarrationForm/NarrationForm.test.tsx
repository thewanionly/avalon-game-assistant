import { render, screen } from '@testing-library/react';
import { MIN_PLAYERS, NarrationForm } from './NarrationForm';

describe('NarrationForm', () => {
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
