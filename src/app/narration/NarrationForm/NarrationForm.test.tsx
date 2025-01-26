import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MAX_PLAYERS, MIN_PLAYERS, NarrationForm } from './NarrationForm';
import {
  DEFAULT_EVIL_CHARACTERS_VALUE,
  DEFAULT_GOOD_CHARACTERS_VALUE,
  EVIL_AVALON_CHARACTERS,
  GOOD_AVALON_CHARACTERS,
  GOOD_REQUIRED_CHARACTERS,
  EVIL_REQUIRED_CHARACTERS,
} from '@/constants/characters';

const allRequiredCharacters = [...GOOD_REQUIRED_CHARACTERS, ...EVIL_REQUIRED_CHARACTERS];
const TOTAL_DEFAULT_CHECKED =
  DEFAULT_GOOD_CHARACTERS_VALUE.length + DEFAULT_EVIL_CHARACTERS_VALUE.length;

describe('Narration Form', () => {
  describe('Layout and default state', () => {
    it('displays "Good characters" label', () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      const goodCharactersLabel = screen.getByText('Good characters');
      expect(goodCharactersLabel).toBeInTheDocument();
    });

    it(`displays "Good characters" checkboxes with correct labels"`, () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      GOOD_AVALON_CHARACTERS.forEach(({ id }) => {
        const checkbox = screen.getByRole('checkbox', { name: id });
        expect(checkbox).toBeInTheDocument();
      });
    });

    it(`checks ${DEFAULT_GOOD_CHARACTERS_VALUE} "Good characters" by default`, () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      GOOD_AVALON_CHARACTERS.forEach(({ id }) => {
        const checkbox = screen.getByRole('checkbox', { name: id });

        if (DEFAULT_GOOD_CHARACTERS_VALUE.includes(id)) {
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

    it(`displays "Evil characters" checkboxes with correct labels"`, () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      EVIL_AVALON_CHARACTERS.forEach(({ id }) => {
        const checkbox = screen.getByRole('checkbox', { name: id });
        expect(checkbox).toBeInTheDocument();
      });
    });

    it(`checks ${DEFAULT_EVIL_CHARACTERS_VALUE.length} "Evil characters" checkboxes by default`, () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      EVIL_AVALON_CHARACTERS.forEach(({ id }) => {
        const checkbox = screen.getByRole('checkbox', { name: id });

        if (DEFAULT_EVIL_CHARACTERS_VALUE.includes(id)) {
          expect(checkbox).toBeChecked();
        } else {
          expect(checkbox).not.toBeChecked();
        }
      });
    });

    it('marks required checkboxes properly', () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      allRequiredCharacters.forEach(({ id }) => {
        const checkbox = screen.getByRole('checkbox', { name: id });
        expect(checkbox).toBeRequired();
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

  describe('Checkbox interaction', () => {
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
      const checkboxEl = screen.getByRole('checkbox', { name: EVIL_AVALON_CHARACTERS[0].id });
      expect(checkboxEl).not.toBeChecked();
      await userEvent.click(checkboxEl);

      // assert play button number
      expect(playBtn).toHaveTextContent(`${TOTAL_DEFAULT_CHECKED + 1}`);
    });
  });

  describe('Required characters validation', () => {
    it.each(allRequiredCharacters)(
      `shows an error when $name is not checked`,
      async ({ id, name }) => {
        render(<NarrationForm onFormSubmit={jest.fn()} />);

        // check another non-required checkbox (this is to ensure we don't get min char limit error)
        const checkboxEl = screen.getByRole('checkbox', { name: EVIL_AVALON_CHARACTERS[0].id });
        await userEvent.click(checkboxEl);

        // uncheck a required checkbox
        const requiredCheckbox = screen.getByRole('checkbox', { name: id });
        expect(requiredCheckbox).toBeChecked();
        await userEvent.click(requiredCheckbox);

        // assert an error message
        const errorMessage = screen.getByText(
          `You must include the following required characters: ${name}`
        );
        expect(errorMessage).toBeInTheDocument();

        // assert play button is disabled
        const playBtn = screen.getByRole('button', { name: /play/i });
        expect(playBtn).toBeDisabled();
      }
    );

    it.each(allRequiredCharacters)(
      `does not show an error anymore when $name is checked after it was unchecked`,
      async ({ id, name }) => {
        render(<NarrationForm onFormSubmit={jest.fn()} />);

        // check another non-required checkbox (this is to ensure we don't get min char limit error)
        const checkboxEl = screen.getByRole('checkbox', { name: EVIL_AVALON_CHARACTERS[0].id });
        await userEvent.click(checkboxEl);

        // uncheck a required checkbox
        const requiredCheckbox = screen.getByRole('checkbox', { name: id });
        expect(requiredCheckbox).toBeChecked();
        await userEvent.click(requiredCheckbox);

        // assert an error message
        const errorMessage = screen.getByText(
          `You must include the following required characters: ${name}`
        );
        expect(errorMessage).toBeInTheDocument();

        // assert play button is disabled
        const playBtn = screen.getByRole('button', { name: /play/i });
        expect(playBtn).toBeDisabled();

        // check the required checkbox
        await userEvent.click(requiredCheckbox);

        // assert error message is not present anymore
        expect(errorMessage).not.toBeInTheDocument();

        // assert play button is eanbled
        expect(playBtn).toBeEnabled();
      }
    );
  });

  describe('Character limit validation', () => {
    it(`shows an error when selected characters are less than ${MIN_PLAYERS}`, async () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      // uncheck a check checkbox - making selected checbkox less than the default
      const checkboxEl = screen.getByRole('checkbox', { name: DEFAULT_EVIL_CHARACTERS_VALUE[1] });
      await userEvent.click(checkboxEl);

      // assert error message
      const errorMessage = screen.getByText(
        `The minimum number of players is ${MIN_PLAYERS}. Please add more players.`
      );
      expect(errorMessage).toBeInTheDocument();

      // assert play button is disabled
      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toBeDisabled();
    });

    it(`hides the error message after selecting ${MIN_PLAYERS} players after selecting less`, async () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      // uncheck a check checkbox - making selected checbkox less than the default
      const checkboxEl = screen.getByRole('checkbox', { name: DEFAULT_EVIL_CHARACTERS_VALUE[1] });
      await userEvent.click(checkboxEl);

      // assert error message
      const errorMessage = screen.getByText(
        `The minimum number of players is ${MIN_PLAYERS}. Please add more players.`
      );
      expect(errorMessage).toBeInTheDocument();

      // assert play button is disabled
      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toBeDisabled();

      // check a checkbox - making selected checbkox back to the default
      const checkboxEl2 = screen.getByRole('checkbox', { name: DEFAULT_EVIL_CHARACTERS_VALUE[1] });
      await userEvent.click(checkboxEl2);

      // assert error message is not shown
      const errorMessage2 = screen.queryByText(
        `The minimum number of players is ${MIN_PLAYERS}. Please add more players.`
      );
      expect(errorMessage2).not.toBeInTheDocument();

      // assert play button is not  disabled
      const playBtn2 = screen.getByRole('button', { name: /play/i });
      expect(playBtn2).not.toBeDisabled();
    });

    it(`hides the error message after selecting more than ${MIN_PLAYERS} players after selecting less`, async () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      // uncheck a check checkbox - making selected checbkox less than the default
      const checkboxEl = screen.getByRole('checkbox', { name: DEFAULT_EVIL_CHARACTERS_VALUE[1] });
      await userEvent.click(checkboxEl);

      // assert error message
      const errorMessage = screen.getByText(
        `The minimum number of players is ${MIN_PLAYERS}. Please add more players.`
      );
      expect(errorMessage).toBeInTheDocument();

      // assert play button is disabled
      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toBeDisabled();

      // check two checkboxes - making selected checbkox more than the default
      await userEvent.click(
        screen.getByRole('checkbox', { name: DEFAULT_EVIL_CHARACTERS_VALUE[1] })
      );
      await userEvent.click(screen.getByRole('checkbox', { name: EVIL_AVALON_CHARACTERS[0].id }));

      // assert error message is not shown
      const errorMessage2 = screen.queryByText(
        `The minimum number of players is ${MIN_PLAYERS}. Please add more players.`
      );
      expect(errorMessage2).not.toBeInTheDocument();

      // assert play button is not  disabled
      const playBtn2 = screen.getByRole('button', { name: /play/i });
      expect(playBtn2).not.toBeDisabled();
    });

    it(`shows an error when selected characters are more than ${MAX_PLAYERS}`, async () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      // check checkboxes until it exceeds the max
      for (const goodChar of GOOD_AVALON_CHARACTERS.filter(
        ({ id }) => !DEFAULT_GOOD_CHARACTERS_VALUE.includes(id)
      )) {
        await userEvent.click(screen.getByRole('checkbox', { name: goodChar.id }));
      }

      for (const evilChar of EVIL_AVALON_CHARACTERS.filter(
        ({ id }) => !DEFAULT_EVIL_CHARACTERS_VALUE.includes(id)
      ).slice(0, 2)) {
        await userEvent.click(screen.getByRole('checkbox', { name: evilChar.id }));
      }

      // assert error message
      const errorMessage = screen.getByText(
        `The maximum number of players is ${MAX_PLAYERS}. Please reduce the number of players.`
      );
      expect(errorMessage).toBeInTheDocument();

      // assert play button is disabled
      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toBeDisabled();
    });

    it(`hides the error message after selecting ${MAX_PLAYERS} players after selecting more`, async () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      // check checkboxes until it exceeds the max
      for (const goodChar of GOOD_AVALON_CHARACTERS.filter(
        ({ id }) => !DEFAULT_GOOD_CHARACTERS_VALUE.includes(id)
      )) {
        await userEvent.click(screen.getByRole('checkbox', { name: goodChar.id }));
      }

      for (const evilChar of EVIL_AVALON_CHARACTERS.filter(
        ({ id }) => !DEFAULT_EVIL_CHARACTERS_VALUE.includes(id)
      ).slice(0, 2)) {
        await userEvent.click(screen.getByRole('checkbox', { name: evilChar.id }));
      }

      // assert error message
      const errorMessage = screen.getByText(
        `The maximum number of players is ${MAX_PLAYERS}. Please reduce the number of players.`
      );
      expect(errorMessage).toBeInTheDocument();

      // assert play button is disabled
      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toBeDisabled();

      // uncheck one checkbox - making it back to the max
      await userEvent.click(screen.getByRole('checkbox', { name: GOOD_AVALON_CHARACTERS[2].id }));

      // assert error message is not shown
      const errorMessage2 = screen.queryByText(
        `The maximum number of players is ${MAX_PLAYERS}. Please reduce the number of players.`
      );
      expect(errorMessage2).not.toBeInTheDocument();

      // assert play button is not  disabled
      const playBtn2 = screen.getByRole('button', { name: /play/i });
      expect(playBtn2).not.toBeDisabled();
    });

    it(`hides the error message after selecting less than ${MAX_PLAYERS} players after selecting more`, async () => {
      render(<NarrationForm onFormSubmit={jest.fn()} />);

      // check checkboxes until it exceeds the max
      for (const goodChar of GOOD_AVALON_CHARACTERS.filter(
        ({ id }) => !DEFAULT_GOOD_CHARACTERS_VALUE.includes(id)
      )) {
        await userEvent.click(screen.getByRole('checkbox', { name: goodChar.id }));
      }

      for (const evilChar of EVIL_AVALON_CHARACTERS.filter(
        ({ id }) => !DEFAULT_EVIL_CHARACTERS_VALUE.includes(id)
      ).slice(0, 2)) {
        await userEvent.click(screen.getByRole('checkbox', { name: evilChar.id }));
      }

      // assert error message
      const errorMessage = screen.getByText(
        `The maximum number of players is ${MAX_PLAYERS}. Please reduce the number of players.`
      );
      expect(errorMessage).toBeInTheDocument();

      // assert play button is disabled
      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toBeDisabled();

      // uncheck two checkboxes - making it less than the max
      await userEvent.click(screen.getByRole('checkbox', { name: GOOD_AVALON_CHARACTERS[2].id }));
      await userEvent.click(screen.getByRole('checkbox', { name: EVIL_AVALON_CHARACTERS[0].id }));

      // assert error message is not shown
      const errorMessage2 = screen.queryByText(
        `The maximum number of players is ${MAX_PLAYERS}. Please reduce the number of players.`
      );
      expect(errorMessage2).not.toBeInTheDocument();

      // assert play button is not  disabled
      const playBtn2 = screen.getByRole('button', { name: /play/i });
      expect(playBtn2).not.toBeDisabled();
    });
  });

  describe('Character distribution validation', () => {
    // TODO: in a 5 player game, good chars should be 3 and evil should be 2
    // TODO: in a 6 player game, good chars should be 4 and evil should be 2
    // TODO: in a 7 player game, good chars should be 4 and evil should be 3
    // TODO: in a 8 player game, good chars should be 5 and evil should be 3
    // TODO: in a 9 player game, good chars should be 6 and evil should be 3
    // TODO: in a 10 player game, good chars should be 6 and evil should be 4
  });

  // TODO: selecting 5 will transition to narrating state
  // TODO: selecting 10 will transition to narrating state
  // TODO: selecting 8 will transition to narrating state
  // TODO: it does not go to narrating state when required checkbox is not checked
  // TODO: it does not go to narrating state when less than 5 players is selected
  // TODO: it does not go to narrating state when more than 10 players is selected
});
