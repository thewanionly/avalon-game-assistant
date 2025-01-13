import { render, screen } from '@testing-library/react';

import { APP_TITLE } from '@/constants/app';

import Page from '../app/page';

const setup = () => render(<Page />);

describe('Home Page', () => {
  it('renders app title heading', () => {
    setup();

    const appTitle = screen.getByRole('heading', { name: APP_TITLE, level: 1 });

    expect(appTitle).toBeInTheDocument();
  });

  it('renders home page unchanged', () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
