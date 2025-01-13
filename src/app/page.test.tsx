import { render, screen } from '@testing-library/react';

import { APP_TITLE, NARRATION } from '@/constants/app';

import Page from '../app/page';

const setup = () => render(<Page />);

describe('Home Page', () => {
  it('renders app title heading', () => {
    setup();

    const appTitle = screen.getByRole('heading', { name: APP_TITLE, level: 1 });

    expect(appTitle).toBeInTheDocument();
  });

  it('renders link to narration page', () => {
    setup();

    const narrationLink = screen.getByRole('link', { name: NARRATION.linkLabel });

    expect(narrationLink).toBeInTheDocument();
    expect(narrationLink).toHaveAttribute('href', NARRATION.href);
  });

  it('renders home page unchanged', () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
