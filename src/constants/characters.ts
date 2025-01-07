export enum AvalonCharacterName {
  Merlin = 'Merlin',
  Percival = 'Percival',
  LoyalServantOfArthur = 'Loyal Servant of Arthur',
  Mordred = 'Mordred',
  Morgana = 'Morgana',
  Oberon = 'Oberon',
  Assassin = 'Assassin',
  MinionOfMordred = 'Minion of Mordred',
}

export enum AvalonCharacterLoyalty {
  Good = 'good',
  Evil = 'evil',
}

interface AvalonCharacter {
  name: string;
  loyalty: AvalonCharacterLoyalty;
  count: number;
  isAdditional?: boolean;
  isRequired?: boolean;
}

export const AVALON_CHARACTERS: AvalonCharacter[] = [
  {
    name: AvalonCharacterName.Merlin,
    loyalty: AvalonCharacterLoyalty.Good,
    count: 1,
    isRequired: true,
  },
  {
    name: AvalonCharacterName.Percival,
    loyalty: AvalonCharacterLoyalty.Good,
    count: 1,
    isAdditional: true,
  },
  {
    name: AvalonCharacterName.LoyalServantOfArthur,
    loyalty: AvalonCharacterLoyalty.Good,
    count: 5,
  },
  {
    name: AvalonCharacterName.Mordred,
    loyalty: AvalonCharacterLoyalty.Evil,
    count: 1,
    isAdditional: true,
  },
  {
    name: AvalonCharacterName.Morgana,
    loyalty: AvalonCharacterLoyalty.Evil,
    count: 1,
    isAdditional: true,
  },
  {
    name: AvalonCharacterName.Oberon,
    loyalty: AvalonCharacterLoyalty.Evil,
    count: 1,
    isAdditional: true,
  },
  {
    name: AvalonCharacterName.Assassin,
    loyalty: AvalonCharacterLoyalty.Evil,
    count: 1,
    isRequired: true,
  },
  {
    name: AvalonCharacterName.MinionOfMordred,
    loyalty: AvalonCharacterLoyalty.Evil,
    count: 3,
  },
];

const groupCharacters = (loyalty: AvalonCharacterLoyalty) =>
  AVALON_CHARACTERS.filter((character) => character.loyalty === loyalty).flatMap((character) =>
    Array.from({ length: character.count }, (_, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { count, ...rest } = character; // Exclude `count` if not needed in the resulting objects
      const uniqueName = character.count > 1 ? `${character.name} ${index + 1}` : character.name; // Append numbers if needed
      return { ...rest, name: uniqueName }; // Return the updated object
    })
  );

export const GOOD_AVALON_CHARACTERS = groupCharacters(AvalonCharacterLoyalty.Good);
export const EVIL_AVALON_CHARACTERS = groupCharacters(AvalonCharacterLoyalty.Evil);

export const REQUIRED_CHARACTERS = AVALON_CHARACTERS.filter(({ isRequired }) => isRequired);

export const TEAM_DISTRIBUTION = {
  5: {
    [AvalonCharacterLoyalty.Good]: 3,
    [AvalonCharacterLoyalty.Evil]: 2,
  },
  6: {
    [AvalonCharacterLoyalty.Good]: 4,
    [AvalonCharacterLoyalty.Evil]: 2,
  },
  7: {
    [AvalonCharacterLoyalty.Good]: 4,
    [AvalonCharacterLoyalty.Evil]: 3,
  },
  8: {
    [AvalonCharacterLoyalty.Good]: 5,
    [AvalonCharacterLoyalty.Evil]: 3,
  },
  9: {
    [AvalonCharacterLoyalty.Good]: 6,
    [AvalonCharacterLoyalty.Evil]: 3,
  },
  10: {
    [AvalonCharacterLoyalty.Good]: 6,
    [AvalonCharacterLoyalty.Evil]: 4,
  },
};
