enum AvalonCharacterLoyalty {
  Good = 'good',
  Evil = 'evil',
}

interface AvalonCharacter {
  name: string;
  loyalty: AvalonCharacterLoyalty;
  count: number;
  isAdditional?: boolean;
}

export const AVALON_CHARACTERS: AvalonCharacter[] = [
  {
    name: 'Merlin',
    loyalty: AvalonCharacterLoyalty.Good,
    count: 1,
  },
  {
    name: 'Percival',
    loyalty: AvalonCharacterLoyalty.Good,
    count: 1,
    isAdditional: true,
  },
  {
    name: 'Loyal Servant of Arthur',
    loyalty: AvalonCharacterLoyalty.Good,
    count: 5,
  },
  {
    name: 'Mordred',
    loyalty: AvalonCharacterLoyalty.Evil,
    count: 1,
    isAdditional: true,
  },
  {
    name: 'Morgana',
    loyalty: AvalonCharacterLoyalty.Evil,
    count: 1,
    isAdditional: true,
  },
  {
    name: 'Oberon',
    loyalty: AvalonCharacterLoyalty.Evil,
    count: 1,
    isAdditional: true,
  },
  {
    name: 'Assassin',
    loyalty: AvalonCharacterLoyalty.Evil,
    count: 1,
  },
  {
    name: 'Minion of Mordred',
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
