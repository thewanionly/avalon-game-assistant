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

export const GOOD_AVALON_CHARACTERS = AVALON_CHARACTERS.filter(
  ({ loyalty }) => loyalty === AvalonCharacterLoyalty.Good
).flatMap((character) =>
  Array.from({ length: character.count }, () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { count, ...rest } = character; // Exclude `count` if not needed in the resulting objects
    return rest;
  })
);

export const EVIL_AVALON_CHARACTERS = AVALON_CHARACTERS.filter(
  ({ loyalty }) => loyalty === AvalonCharacterLoyalty.Evil
).flatMap((character) =>
  Array.from({ length: character.count }, () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { count, ...rest } = character; // Exclude `count` if not needed in the resulting objects
    return rest;
  })
);
