import { OptionalCharacterFlags } from '@/constants/characters';
import { TeamBalanceResult } from './checkTeamBalance.types';
import { UBALANCED_TEAM_MESSAGE } from './checkTeamBalance.constants';

const isTruthyItems = (...args: boolean[]): boolean => args.every((arg) => Boolean(arg));
const isFalsyItems = (...args: boolean[]): boolean => args.every((arg) => !Boolean(arg));

export const checkTeamBalance = (flags?: OptionalCharacterFlags): TeamBalanceResult => {
  const {
    hasPercival = false,
    hasMordred = false,
    hasMorgana = false,
    hasOberon = false,
  } = flags ?? {};

  if (isTruthyItems(hasPercival) && isFalsyItems(hasOberon, hasMordred, hasMorgana)) {
    return {
      isBalanced: false,
      message: UBALANCED_TEAM_MESSAGE.ONLY_PERCIVAL,
    };
  }

  if (isTruthyItems(hasPercival, hasOberon) && isFalsyItems(hasMordred, hasMorgana)) {
    return {
      isBalanced: false,
      message: UBALANCED_TEAM_MESSAGE.WITH_PERCIVAL_OBERON,
    };
  }

  if (isTruthyItems(hasPercival, hasOberon, hasMordred) && isFalsyItems(hasMorgana)) {
    return {
      isBalanced: false,
      message: UBALANCED_TEAM_MESSAGE.WITH_PERCIVAL_OBERON_MORDRED,
    };
  }

  if (isTruthyItems(hasPercival, hasOberon, hasMorgana) && isFalsyItems(hasMordred)) {
    return {
      isBalanced: false,
      message: UBALANCED_TEAM_MESSAGE.WITH_PERCIVAL_OBERON_MORGANA,
    };
  }

  if (isTruthyItems(hasPercival, hasMordred, hasMorgana) && isFalsyItems(hasOberon)) {
    return {
      isBalanced: false,
      message: UBALANCED_TEAM_MESSAGE.WITH_PERCIVAL_MORDRED_MORGANA,
    };
  }

  if (isTruthyItems(hasMordred) && isFalsyItems(hasOberon, hasPercival, hasMorgana)) {
    return {
      isBalanced: false,
      message: UBALANCED_TEAM_MESSAGE.ONLY_MORDRED,
    };
  }

  if (isTruthyItems(hasMordred, hasMorgana) && isFalsyItems(hasOberon, hasPercival)) {
    return {
      isBalanced: false,
      message: UBALANCED_TEAM_MESSAGE.WITH_MORDRED_MORGANA,
    };
  }

  if (isTruthyItems(hasOberon) && isFalsyItems(hasPercival, hasMordred, hasMorgana)) {
    return {
      isBalanced: false,
      message: UBALANCED_TEAM_MESSAGE.ONLY_OBERON,
    };
  }

  if (isTruthyItems(hasOberon, hasMorgana) && isFalsyItems(hasPercival, hasMordred)) {
    return {
      isBalanced: false,
      message: UBALANCED_TEAM_MESSAGE.WITH_OBERON_MORGANA,
    };
  }

  return { isBalanced: true };
};
