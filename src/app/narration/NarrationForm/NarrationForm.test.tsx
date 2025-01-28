import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MAX_PLAYERS, MIN_PLAYERS, NarrationForm } from './NarrationForm';
import {
  DEFAULT_EVIL_CHARACTERS,
  DEFAULT_GOOD_CHARACTERS,
  EVIL_AVALON_CHARACTERS,
  GOOD_AVALON_CHARACTERS,
  GOOD_REQUIRED_CHARACTERS,
  EVIL_REQUIRED_CHARACTERS,
} from '@/constants/characters';
import { DEFAULT_NARRATION_FORM_VALUES } from './NarrationForm.constants';

const allRequiredCharacters = [...GOOD_REQUIRED_CHARACTERS, ...EVIL_REQUIRED_CHARACTERS];
const TOTAL_DEFAULT_CHECKED = DEFAULT_GOOD_CHARACTERS.length + DEFAULT_EVIL_CHARACTERS.length;

const setup = (defaultValues = DEFAULT_NARRATION_FORM_VALUES) =>
  render(<NarrationForm defaultValues={defaultValues} onFormSubmit={jest.fn()} />);

describe('Narration Form', () => {
  describe('Layout and default state', () => {
    it('displays "Good characters" label', () => {
      setup();

      const goodCharactersLabel = screen.getByText('Good characters');
      expect(goodCharactersLabel).toBeInTheDocument();
    });

    it(`displays "Good characters" checkboxes with correct labels"`, () => {
      setup();

      GOOD_AVALON_CHARACTERS.forEach(({ uniqueLabel }) => {
        const checkbox = screen.getByRole('checkbox', { name: uniqueLabel });
        expect(checkbox).toBeInTheDocument();
      });
    });

    it(`checks ${DEFAULT_GOOD_CHARACTERS.length} "Good characters" by default`, () => {
      setup();

      GOOD_AVALON_CHARACTERS.forEach(({ uniqueLabel }) => {
        const checkbox = screen.getByRole('checkbox', { name: uniqueLabel });

        if (DEFAULT_GOOD_CHARACTERS.find((c) => c.uniqueLabel === uniqueLabel)) {
          expect(checkbox).toBeChecked();
        } else {
          expect(checkbox).not.toBeChecked();
        }
      });
    });

    it('displays "Evil characters" label', () => {
      setup();

      const evilCharactersLabel = screen.getByText('Evil characters');
      expect(evilCharactersLabel).toBeInTheDocument();
    });

    it(`displays "Evil characters" checkboxes with correct labels"`, () => {
      setup();

      EVIL_AVALON_CHARACTERS.forEach(({ uniqueLabel }) => {
        const checkbox = screen.getByRole('checkbox', { name: uniqueLabel });
        expect(checkbox).toBeInTheDocument();
      });
    });

    it(`checks ${DEFAULT_EVIL_CHARACTERS.length} "Evil characters" checkboxes by default`, () => {
      setup();

      EVIL_AVALON_CHARACTERS.forEach(({ uniqueLabel }) => {
        const checkbox = screen.getByRole('checkbox', { name: uniqueLabel });

        if (DEFAULT_EVIL_CHARACTERS.find((c) => c.uniqueLabel === uniqueLabel)) {
          expect(checkbox).toBeChecked();
        } else {
          expect(checkbox).not.toBeChecked();
        }
      });
    });

    it('marks required checkboxes properly', () => {
      setup();

      allRequiredCharacters.forEach(({ uniqueLabel }) => {
        const checkbox = screen.getByRole('checkbox', { name: uniqueLabel });
        expect(checkbox).toBeRequired();
      });
    });

    it(`displays Play button`, () => {
      setup();

      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toBeInTheDocument();
    });

    it(`displays the number "${TOTAL_DEFAULT_CHECKED}" in the Play button by default (corresponds to the number of default checked checkboxes)`, () => {
      setup();

      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toHaveTextContent(`${TOTAL_DEFAULT_CHECKED}`);
    });
  });

  describe('Checkbox interaction', () => {
    it('checks and unchecks checkboxes', async () => {
      setup();

      // checked (default)
      const checkboxEl = screen.getByRole('checkbox', {
        name: DEFAULT_GOOD_CHARACTERS[0].uniqueLabel,
      });
      expect(checkboxEl).toBeChecked();

      // unchecked
      await userEvent.click(checkboxEl);
      expect(checkboxEl).not.toBeChecked();

      // checked
      await userEvent.click(checkboxEl);
      expect(checkboxEl).toBeChecked();
    });

    it('increments play button number when a new checkbox is checked', async () => {
      setup();

      // default
      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toHaveTextContent(`${TOTAL_DEFAULT_CHECKED}`);

      // check an unchecked checkbox
      const checkboxEl = screen.getByRole('checkbox', {
        name: EVIL_AVALON_CHARACTERS[0].uniqueLabel,
      });
      expect(checkboxEl).not.toBeChecked();
      await userEvent.click(checkboxEl);

      // assert play button number
      expect(playBtn).toHaveTextContent(`${TOTAL_DEFAULT_CHECKED + 1}`);
    });
  });

  describe('Required characters validation', () => {
    it.each(allRequiredCharacters)(
      `shows an error when $name is not checked`,
      async ({ uniqueLabel, name }) => {
        setup();

        // check another non-required checkbox (this is to ensure we don't get min char limit error)
        const checkboxEl = screen.getByRole('checkbox', {
          name: EVIL_AVALON_CHARACTERS[0].uniqueLabel,
        });
        await userEvent.click(checkboxEl);

        // uncheck a required checkbox
        const requiredCheckbox = screen.getByRole('checkbox', { name: uniqueLabel });
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
      async ({ uniqueLabel, name }) => {
        setup();

        // check another non-required checkbox (this is to ensure we don't get min char limit error)
        const checkboxEl = screen.getByRole('checkbox', {
          name: EVIL_AVALON_CHARACTERS[0].uniqueLabel,
        });
        await userEvent.click(checkboxEl);

        // uncheck a required checkbox
        const requiredCheckbox = screen.getByRole('checkbox', { name: uniqueLabel });
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
      setup();

      // uncheck a check checkbox - making selected checbkox less than the default
      const checkboxEl = screen.getByRole('checkbox', {
        name: DEFAULT_EVIL_CHARACTERS[1].uniqueLabel,
      });
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
      setup();

      // uncheck a check checkbox - making selected checbkox less than the default
      const checkboxEl = screen.getByRole('checkbox', {
        name: DEFAULT_EVIL_CHARACTERS[1].uniqueLabel,
      });
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
      const checkboxEl2 = screen.getByRole('checkbox', {
        name: DEFAULT_EVIL_CHARACTERS[1].uniqueLabel,
      });
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
      setup();

      // uncheck a check checkbox - making selected checbkox less than the default
      const checkboxEl = screen.getByRole('checkbox', {
        name: DEFAULT_EVIL_CHARACTERS[1].uniqueLabel,
      });
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
        screen.getByRole('checkbox', { name: DEFAULT_EVIL_CHARACTERS[1].uniqueLabel })
      );
      await userEvent.click(
        screen.getByRole('checkbox', { name: EVIL_AVALON_CHARACTERS[0].uniqueLabel })
      );

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
      setup();

      // check checkboxes until it exceeds the max
      for (const goodChar of GOOD_AVALON_CHARACTERS.filter(
        ({ uniqueLabel }) => !DEFAULT_GOOD_CHARACTERS.find((c) => c.uniqueLabel === uniqueLabel)
      )) {
        await userEvent.click(screen.getByRole('checkbox', { name: goodChar.uniqueLabel }));
      }

      for (const evilChar of EVIL_AVALON_CHARACTERS.filter(
        ({ uniqueLabel }) => !DEFAULT_EVIL_CHARACTERS.find((c) => c.uniqueLabel === uniqueLabel)
      ).slice(0, 2)) {
        await userEvent.click(screen.getByRole('checkbox', { name: evilChar.uniqueLabel }));
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
      setup();

      // check checkboxes until it exceeds the max
      for (const goodChar of GOOD_AVALON_CHARACTERS.filter(
        ({ uniqueLabel }) => !DEFAULT_GOOD_CHARACTERS.find((c) => c.uniqueLabel === uniqueLabel)
      )) {
        await userEvent.click(screen.getByRole('checkbox', { name: goodChar.uniqueLabel }));
      }

      for (const evilChar of EVIL_AVALON_CHARACTERS.filter(
        ({ uniqueLabel }) => !DEFAULT_EVIL_CHARACTERS.find((c) => c.uniqueLabel === uniqueLabel)
      ).slice(0, 2)) {
        await userEvent.click(screen.getByRole('checkbox', { name: evilChar.uniqueLabel }));
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
      await userEvent.click(
        screen.getByRole('checkbox', { name: GOOD_AVALON_CHARACTERS[2].uniqueLabel })
      );

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
      setup();

      // check checkboxes until it exceeds the max
      for (const goodChar of GOOD_AVALON_CHARACTERS.filter(
        ({ uniqueLabel }) => !DEFAULT_GOOD_CHARACTERS.find((c) => c.uniqueLabel === uniqueLabel)
      )) {
        await userEvent.click(screen.getByRole('checkbox', { name: goodChar.uniqueLabel }));
      }

      for (const evilChar of EVIL_AVALON_CHARACTERS.filter(
        ({ uniqueLabel }) => !DEFAULT_EVIL_CHARACTERS.find((c) => c.uniqueLabel === uniqueLabel)
      ).slice(0, 2)) {
        await userEvent.click(screen.getByRole('checkbox', { name: evilChar.uniqueLabel }));
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
      await userEvent.click(
        screen.getByRole('checkbox', { name: GOOD_AVALON_CHARACTERS[2].uniqueLabel })
      );
      await userEvent.click(
        screen.getByRole('checkbox', { name: EVIL_AVALON_CHARACTERS[0].uniqueLabel })
      );

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
    describe('5 player game - good (3), evil (2)', () => {
      // TODO: error when good = 4, evil 1
      // TODO: error when good = 2, evil 3
      // TODO: ok when good = 3, evil 2 after all the errors
    });

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
