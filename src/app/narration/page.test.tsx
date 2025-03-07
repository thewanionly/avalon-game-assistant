import { render } from '@testing-library/react';

import Page from '@/app/narration/page';

describe('Narration Page', () => {
  it('renders narration page unchanged', () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
