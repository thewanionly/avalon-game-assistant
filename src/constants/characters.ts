import idify from '@/utils/idify';

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
  id: string;
  name: string;
  loyalty: AvalonCharacterLoyalty;
  isAdditional?: boolean;
  isRequired?: boolean;
  isDefaultChecked?: boolean;
}

const AVALON_CHARACTERS: AvalonCharacter[] = [
  {
    id: idify(AvalonCharacterName.Merlin),
    name: AvalonCharacterName.Merlin,
    loyalty: AvalonCharacterLoyalty.Good,
    isRequired: true,
    isDefaultChecked: true,
  },
  {
    id: idify(AvalonCharacterName.Percival),
    name: AvalonCharacterName.Percival,
    loyalty: AvalonCharacterLoyalty.Good,
    isAdditional: true,
  },
  {
    id: idify(`${AvalonCharacterName.LoyalServantOfArthur} 1`),
    name: AvalonCharacterName.LoyalServantOfArthur,
    loyalty: AvalonCharacterLoyalty.Good,
    isDefaultChecked: true,
  },
  {
    id: idify(`${AvalonCharacterName.LoyalServantOfArthur} 2`),
    name: AvalonCharacterName.LoyalServantOfArthur,
    loyalty: AvalonCharacterLoyalty.Good,
    isDefaultChecked: true,
  },
  {
    id: idify(`${AvalonCharacterName.LoyalServantOfArthur} 3`),
    name: AvalonCharacterName.LoyalServantOfArthur,
    loyalty: AvalonCharacterLoyalty.Good,
  },
  {
    id: idify(`${AvalonCharacterName.LoyalServantOfArthur} 4`),
    name: AvalonCharacterName.LoyalServantOfArthur,
    loyalty: AvalonCharacterLoyalty.Good,
  },
  {
    id: idify(`${AvalonCharacterName.LoyalServantOfArthur} 5`),
    name: AvalonCharacterName.LoyalServantOfArthur,
    loyalty: AvalonCharacterLoyalty.Good,
  },
  {
    id: idify(AvalonCharacterName.Mordred),
    name: AvalonCharacterName.Mordred,
    loyalty: AvalonCharacterLoyalty.Evil,
    isAdditional: true,
  },
  {
    id: idify(AvalonCharacterName.Morgana),
    name: AvalonCharacterName.Morgana,
    loyalty: AvalonCharacterLoyalty.Evil,
    isAdditional: true,
  },
  {
    id: idify(AvalonCharacterName.Oberon),
    name: AvalonCharacterName.Oberon,
    loyalty: AvalonCharacterLoyalty.Evil,
    isAdditional: true,
  },
  {
    id: idify(AvalonCharacterName.Assassin),
    name: AvalonCharacterName.Assassin,
    loyalty: AvalonCharacterLoyalty.Evil,
    isRequired: true,
    isDefaultChecked: true,
  },
  {
    id: idify(`${AvalonCharacterName.MinionOfMordred} 1`),
    name: AvalonCharacterName.MinionOfMordred,
    loyalty: AvalonCharacterLoyalty.Evil,
    isDefaultChecked: true,
  },
  {
    id: idify(`${AvalonCharacterName.MinionOfMordred} 2`),
    name: AvalonCharacterName.MinionOfMordred,
    loyalty: AvalonCharacterLoyalty.Evil,
  },
  {
    id: idify(`${AvalonCharacterName.MinionOfMordred} 3`),
    name: AvalonCharacterName.MinionOfMordred,
    loyalty: AvalonCharacterLoyalty.Evil,
  },
];

export const GOOD_AVALON_CHARACTERS = AVALON_CHARACTERS.filter(
  (character) => character.loyalty === AvalonCharacterLoyalty.Good
);
export const EVIL_AVALON_CHARACTERS = AVALON_CHARACTERS.filter(
  (character) => character.loyalty === AvalonCharacterLoyalty.Evil
);

export const GOOD_REQUIRED_CHARACTERS = GOOD_AVALON_CHARACTERS.filter(
  ({ isRequired }) => isRequired
);
export const EVIL_REQUIRED_CHARACTERS = EVIL_AVALON_CHARACTERS.filter(
  ({ isRequired }) => isRequired
);

export const DEFAULT_GOOD_CHARACTERS_VALUE = GOOD_AVALON_CHARACTERS.filter(
  ({ isDefaultChecked }) => isDefaultChecked
).map(({ id }) => id);
export const DEFAULT_EVIL_CHARACTERS_VALUE = EVIL_AVALON_CHARACTERS.filter(
  ({ isDefaultChecked }) => isDefaultChecked
).map(({ id }) => id);

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
