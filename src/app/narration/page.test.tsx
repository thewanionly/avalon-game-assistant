import { render, screen } from '@testing-library/react';

import { NARRATION } from '@/constants/app';
import Page from '@/app/narration/page';

describe('Narration Page', () => {
  it('renders narration title heading', () => {
    render(<Page />);

    const narrationTitle = screen.getByRole('heading', { name: NARRATION.pageTitle, level: 1 });

    expect(narrationTitle).toBeInTheDocument();
  });

  it('renders narration page unchanged', () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
