import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NarrationForm } from './NarrationForm';
import {
  DEFAULT_EVIL_CHARACTERS,
  DEFAULT_GOOD_CHARACTERS,
  EVIL_AVALON_CHARACTERS,
  GOOD_AVALON_CHARACTERS,
  GOOD_REQUIRED_CHARACTERS,
  EVIL_REQUIRED_CHARACTERS,
  TEAM_DISTRIBUTION,
  AvalonCharacterLoyalty,
  AvalonCharacter,
} from '@/constants/characters';
import { DEFAULT_NARRATION_FORM_VALUES, MAX_PLAYERS, MIN_PLAYERS } from './NarrationForm.constants';
import {
  ERROR_CHARACTER_DISTRIBUTION,
  ERROR_MAX_PLAYERS,
  ERROR_MIN_PLAYERS,
  ERROR_REQUIRED_CHARACTERS,
} from '@/constants/errorMessages';
import { dynamicString } from '@/utils/dynamicString';
import {
  EVIL_CHARACTERS_LABEL,
  EVIL_CHARACTERS_NO_SELECTED_LABEL,
  GOOD_CHARACTERS_LABEL,
  GOOD_CHARACTERS_NO_SELECTED_LABEL,
  PLAY_BUTTON_NO_SELECTED_LABEL,
} from '@/constants/labels';

const allRequiredCharacters = [...GOOD_REQUIRED_CHARACTERS, ...EVIL_REQUIRED_CHARACTERS];
const TOTAL_DEFAULT_CHECKED = DEFAULT_GOOD_CHARACTERS.length + DEFAULT_EVIL_CHARACTERS.length;

const sortedGoodChars = [...new Set([...GOOD_REQUIRED_CHARACTERS, ...GOOD_AVALON_CHARACTERS])];
const sortedEvilChars = [...new Set([...EVIL_REQUIRED_CHARACTERS, ...EVIL_AVALON_CHARACTERS])];

// [numOfPlayers, goodCount, evilCount]
const flattenedTeamDistribution = Object.entries(TEAM_DISTRIBUTION).map(([key, value]) => [
  Number(key),
  value[AvalonCharacterLoyalty.Good],
  value[AvalonCharacterLoyalty.Evil],
]);

const defaultGoodCharsCount = DEFAULT_NARRATION_FORM_VALUES.goodCharacters.length;
const defaultEvilCharsCount = DEFAULT_NARRATION_FORM_VALUES.evilCharacters.length;

const setup = (defaultValues = DEFAULT_NARRATION_FORM_VALUES) =>
  render(<NarrationForm defaultValues={defaultValues} onFormSubmit={jest.fn()} />);

const setupNoDefault = () => setup({ goodCharacters: [], evilCharacters: [] });

describe('Narration Form', () => {
  describe('Layout and default state', () => {
    it('displays "Good characters" label with default selected good characeters count', () => {
      setup();

      const goodCharactersLabel = screen.getByText(
        dynamicString(GOOD_CHARACTERS_LABEL, { count: defaultGoodCharsCount })
      );
      expect(goodCharactersLabel).toBeInTheDocument();
    });

    it(`displays no character count besides "Good characters" label when there's no selected checboxes`, () => {
      setupNoDefault();

      const goodCharactersLabel = screen.getByText(GOOD_CHARACTERS_NO_SELECTED_LABEL);
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

    it('displays "Evil characters" label with default selected evil characters count', () => {
      setup();

      const evilCharactersLabel = screen.getByText(
        dynamicString(EVIL_CHARACTERS_LABEL, { count: defaultEvilCharsCount })
      );
      expect(evilCharactersLabel).toBeInTheDocument();
    });

    it(`displays no character count besides "Evil characters" label when there's no selected checboxes`, () => {
      setupNoDefault();

      const evilCharactersLabel = screen.getByText(EVIL_CHARACTERS_NO_SELECTED_LABEL);
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

    it(`displays no player count besides the Play button when there's no checbkoxes checked`, () => {
      setupNoDefault();

      const playBtn = screen.getByRole('button', { name: PLAY_BUTTON_NO_SELECTED_LABEL });
      expect(playBtn).toBeInTheDocument();
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

    it('increments good characters label number when a new checkbox under good characers is checked', async () => {
      setup();

      // assert current count
      const goodCharactersLabel = screen.getByText(
        dynamicString(GOOD_CHARACTERS_LABEL, { count: defaultGoodCharsCount })
      );
      expect(goodCharactersLabel).toBeInTheDocument();

      // check an unchecked checkbox
      const checkboxEl = screen.getByRole('checkbox', {
        name: GOOD_AVALON_CHARACTERS[GOOD_AVALON_CHARACTERS.length - 1].uniqueLabel,
      });
      expect(checkboxEl).not.toBeChecked();
      await userEvent.click(checkboxEl);

      // assert count is updated
      const goodCharactersLabel2 = screen.getByText(
        dynamicString(GOOD_CHARACTERS_LABEL, { count: defaultGoodCharsCount + 1 })
      );
      expect(goodCharactersLabel2).toBeInTheDocument();
    });

    it('increments evil characters label number when a new checkbox under good characers is checked', async () => {
      setup();

      // assert current count
      const evilCharactersLabel = screen.getByText(
        dynamicString(EVIL_CHARACTERS_LABEL, { count: defaultEvilCharsCount })
      );
      expect(evilCharactersLabel).toBeInTheDocument();

      // check an unchecked checkbox
      const checkboxEl = screen.getByRole('checkbox', {
        name: EVIL_AVALON_CHARACTERS[EVIL_AVALON_CHARACTERS.length - 1].uniqueLabel,
      });
      expect(checkboxEl).not.toBeChecked();
      await userEvent.click(checkboxEl);

      // assert count is updated
      const evilCharactersLabel2 = screen.getByText(
        dynamicString(EVIL_CHARACTERS_LABEL, { count: defaultEvilCharsCount + 1 })
      );
      expect(evilCharactersLabel2).toBeInTheDocument();
    });

    it('increments play button number when a new checkbox is checked', async () => {
      setup();

      // default
      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toHaveTextContent(`${TOTAL_DEFAULT_CHECKED}`);

      // check an unchecked checkbox
      const uncheckedEvilCharacter = EVIL_AVALON_CHARACTERS.find(
        ({ isDefaultChecked }) => !isDefaultChecked
      ) as AvalonCharacter;
      const checkboxEl = screen.getByRole('checkbox', {
        name: uncheckedEvilCharacter.uniqueLabel,
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

        // uncheck a required checkbox
        const requiredCheckbox = screen.getByRole('checkbox', { name: uniqueLabel });
        expect(requiredCheckbox).toBeChecked();
        await userEvent.click(requiredCheckbox);
        expect(requiredCheckbox).not.toBeChecked();

        // assert an error message
        const errorMessage = screen.getByText(
          dynamicString(ERROR_REQUIRED_CHARACTERS, { requiredCharacters: name })
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

        //  uncheck the required checkbox
        const requiredCheckbox = screen.getByRole('checkbox', { name: uniqueLabel });
        expect(requiredCheckbox).toBeChecked();
        await userEvent.click(requiredCheckbox);
        expect(requiredCheckbox).not.toBeChecked();

        // assert an error message
        const errorMessage = screen.getByText(
          dynamicString(ERROR_REQUIRED_CHARACTERS, { requiredCharacters: name })
        );
        expect(errorMessage).toBeInTheDocument();

        // assert play button is disabled
        const playBtn = screen.getByRole('button', { name: /play/i });
        expect(playBtn).toBeDisabled();

        // check the required checkbox
        await userEvent.click(requiredCheckbox);

        // assert error message is not present anymore
        expect(errorMessage).not.toBeInTheDocument();

        // assert play button is enabled
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
        dynamicString(ERROR_MIN_PLAYERS, { minPlayers: MIN_PLAYERS })
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
        dynamicString(ERROR_MIN_PLAYERS, { minPlayers: MIN_PLAYERS })
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
        dynamicString(ERROR_MIN_PLAYERS, { minPlayers: MIN_PLAYERS })
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
        dynamicString(ERROR_MIN_PLAYERS, { minPlayers: MIN_PLAYERS })
      );
      expect(errorMessage).toBeInTheDocument();

      // assert play button is disabled
      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toBeDisabled();

      // check two checkboxes - making selected checbkox more than the default
      await userEvent.click(
        screen.getByRole('checkbox', { name: DEFAULT_EVIL_CHARACTERS[1].uniqueLabel })
      );

      const uncheckedGoodCharacter = GOOD_AVALON_CHARACTERS.find(
        ({ isDefaultChecked }) => !isDefaultChecked
      ) as AvalonCharacter;
      await userEvent.click(
        screen.getByRole('checkbox', { name: uncheckedGoodCharacter.uniqueLabel })
      );

      // assert error message is not shown
      const errorMessage2 = screen.queryByText(
        dynamicString(ERROR_MIN_PLAYERS, { minPlayers: MIN_PLAYERS })
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
        dynamicString(ERROR_MAX_PLAYERS, { maxPlayers: MAX_PLAYERS })
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
        dynamicString(ERROR_MAX_PLAYERS, { maxPlayers: MAX_PLAYERS })
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
        dynamicString(ERROR_MAX_PLAYERS, { maxPlayers: MAX_PLAYERS })
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
        dynamicString(ERROR_MAX_PLAYERS, { maxPlayers: MAX_PLAYERS })
      );
      expect(errorMessage).toBeInTheDocument();

      // assert play button is disabled
      const playBtn = screen.getByRole('button', { name: /play/i });
      expect(playBtn).toBeDisabled();

      // uncheck two checkboxes - making it less than the max
      const uncheckedGoodCharacter = GOOD_AVALON_CHARACTERS.find(
        ({ isDefaultChecked }) => !isDefaultChecked
      ) as AvalonCharacter;
      await userEvent.click(
        screen.getByRole('checkbox', { name: uncheckedGoodCharacter.uniqueLabel })
      );

      const uncheckedEvilCharacter = EVIL_AVALON_CHARACTERS.find(
        ({ isDefaultChecked }) => !isDefaultChecked
      ) as AvalonCharacter;
      await userEvent.click(
        screen.getByRole('checkbox', { name: uncheckedEvilCharacter.uniqueLabel })
      );

      // assert error message is not shown
      const errorMessage2 = screen.queryByText(
        dynamicString(ERROR_MAX_PLAYERS, { maxPlayers: MAX_PLAYERS })
      );
      expect(errorMessage2).not.toBeInTheDocument();

      // assert play button is not  disabled
      const playBtn2 = screen.getByRole('button', { name: /play/i });
      expect(playBtn2).not.toBeDisabled();
    });
  });

  describe('Character distribution validation', () => {
    describe.each(flattenedTeamDistribution)(
      `%i-player game: %i good, %i evil`,
      (numOfPlayers, goodCount, evilCount) => {
        const errorMessageText = dynamicString(ERROR_CHARACTER_DISTRIBUTION, {
          numberOfPlayers: numOfPlayers,
          goodPlayersCount: goodCount,
          evilPlayersCount: evilCount,
        });

        it(`does not show any error message when good chars is ${goodCount} and evil chars is ${evilCount}`, async () => {
          // render form with no default values
          setupNoDefault();

          // check 4 good chars
          const goodCharsToCheck = sortedGoodChars.slice(0, goodCount);

          for (const goodChar of goodCharsToCheck) {
            await userEvent.click(screen.getByRole('checkbox', { name: goodChar.uniqueLabel }));
          }

          // check 1 evil char
          const evilCharsToCheck = sortedEvilChars.slice(0, evilCount);

          for (const evilChar of evilCharsToCheck) {
            await userEvent.click(screen.getByRole('checkbox', { name: evilChar.uniqueLabel }));
          }

          // assert that error is shown
          const errorMessage = screen.queryByText(errorMessageText);
          expect(errorMessage).not.toBeInTheDocument();

          // assert that button is disabled
          const playBtn = screen.getByRole('button', { name: /play/i });
          expect(playBtn).not.toBeDisabled();
        });

        it(`shows an error message when good chars is ${goodCount + 1} and evil chars is  ${evilCount - 1}`, async () => {
          // render form with no default values
          setupNoDefault();

          // check 4 good chars
          const goodCharsToCheck = sortedGoodChars.slice(0, goodCount + 1);

          for (const goodChar of goodCharsToCheck) {
            await userEvent.click(screen.getByRole('checkbox', { name: goodChar.uniqueLabel }));
          }

          // check 1 evil char
          const evilCharsToCheck = sortedEvilChars.slice(0, evilCount - 1);

          for (const evilChar of evilCharsToCheck) {
            await userEvent.click(screen.getByRole('checkbox', { name: evilChar.uniqueLabel }));
          }

          // assert that error is shown
          const errorMessage = screen.getByText(errorMessageText);
          expect(errorMessage).toBeInTheDocument();

          // assert that button is disabled
          const playBtn = screen.getByRole('button', { name: /play/i });
          expect(playBtn).toBeDisabled();
        });

        it(`shows an error message when good chars is ${goodCount - 1} and evil char is ${evilCount + 1}`, async () => {
          // render form with no default values
          setupNoDefault();

          // check 2 good chars
          const goodCharsToCheck = sortedGoodChars.slice(0, goodCount - 1);

          for (const goodChar of goodCharsToCheck) {
            await userEvent.click(screen.getByRole('checkbox', { name: goodChar.uniqueLabel }));
          }

          // check 3 evil chars
          const evilCharsToCheck = sortedEvilChars.slice(0, evilCount + 1);

          for (const evilChar of evilCharsToCheck) {
            await userEvent.click(screen.getByRole('checkbox', { name: evilChar.uniqueLabel }));
          }

          // assert that error is shown
          const errorMessage = screen.getByText(errorMessageText);
          expect(errorMessage).toBeInTheDocument();

          // assert that button is disabled
          const playBtn = screen.getByRole('button', { name: /play/i });
          expect(playBtn).toBeDisabled();
        });

        it(`hides the error message when good chars is ${goodCount} and evil chars is ${evilCount} after incorrect distribution`, async () => {
          // render form with no default values
          setupNoDefault();

          // check 4 good chars
          const goodCharsToCheck = sortedGoodChars.slice(0, goodCount + 1);

          for (const goodChar of goodCharsToCheck) {
            await userEvent.click(screen.getByRole('checkbox', { name: goodChar.uniqueLabel }));
          }

          // check 1 evil char
          const evilCharsToCheck = sortedEvilChars.slice(0, evilCount - 1);

          for (const evilChar of evilCharsToCheck) {
            await userEvent.click(screen.getByRole('checkbox', { name: evilChar.uniqueLabel }));
          }

          // assert that error is shown
          const errorMessage = screen.getByText(errorMessageText);
          expect(errorMessage).toBeInTheDocument();

          // assert that button is disabled
          const playBtn = screen.getByRole('button', { name: /play/i });
          expect(playBtn).toBeDisabled();

          /* select the correct distribution */
          // check 1 less good chars (find the first non-required -> fallback to the last item in the array)
          const goodCharToRemove =
            goodCharsToCheck.find(({ isRequired }) => !isRequired) ??
            goodCharsToCheck[goodCharsToCheck.length - 1];
          await userEvent.click(
            screen.getByRole('checkbox', { name: goodCharToRemove.uniqueLabel })
          );

          // check 1 more evil char
          const evilCharToAdd = sortedEvilChars[1 + (evilCount - 1)];
          await userEvent.click(screen.getByRole('checkbox', { name: evilCharToAdd.uniqueLabel }));

          // assert that error is shown
          const errorMessage2 = screen.queryByText(errorMessageText);
          expect(errorMessage2).not.toBeInTheDocument();

          // assert that button is disabled
          const playBtn2 = screen.getByRole('button', { name: /play/i });
          expect(playBtn2).not.toBeDisabled();
        });
      }
    );
  });

  // Testing NarrationArea
  // TODO: selecting 5 will transition to narrating state
  // TODO: selecting 10 will transition to narrating state
  // TODO: selecting 8 will transition to narrating state
  // TODO: it does not go to narrating state when required checkbox is not checked
  // TODO: it does not go to narrating state when less than 5 players is selected
  // TODO: it does not go to narrating state when more than 10 players is selected
});
