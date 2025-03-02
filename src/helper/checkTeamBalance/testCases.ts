import { UBALANCED_TEAM_MESSAGE } from './checkTeamBalance.constants';
import { TeamBalanceResult } from './checkTeamBalance.types';

export const testCases: {
  hasMordred?: boolean;
  hasOberon?: boolean;
  hasPercival?: boolean;
  hasMorgana?: boolean;
  expected: TeamBalanceResult;
}[] = [
  {
    hasMordred: false,
    hasOberon: false,
    hasPercival: false,
    hasMorgana: false,
    expected: { isBalanced: true },
  },
  {
    hasMordred: false,
    hasOberon: false,
    hasPercival: false,
    hasMorgana: true,
    expected: { isBalanced: true }, // this is balanced because adding Morgana without Percival makes Morgana's power useless
  },
  {
    hasMordred: false,
    hasOberon: false,
    hasPercival: true,
    hasMorgana: false,
    expected: { isBalanced: false, message: UBALANCED_TEAM_MESSAGE.ONLY_PERCIVAL },
  },
  {
    hasMordred: false,
    hasOberon: false,
    hasPercival: true,
    hasMorgana: true,
    expected: { isBalanced: true },
  },
  {
    hasMordred: false,
    hasOberon: true,
    hasPercival: false,
    hasMorgana: false,
    expected: { isBalanced: false, message: UBALANCED_TEAM_MESSAGE.ONLY_OBERON },
  },
  {
    hasMordred: false,
    hasOberon: true,
    hasPercival: false,
    hasMorgana: true,
    expected: { isBalanced: false, message: UBALANCED_TEAM_MESSAGE.WITH_OBERON_MORGANA }, // this is unbalanced because adding Morgana without Percival makes Morgana's power useless
  },
  {
    hasMordred: false,
    hasOberon: true,
    hasPercival: true,
    hasMorgana: false,
    expected: { isBalanced: false, message: UBALANCED_TEAM_MESSAGE.WITH_PERCIVAL_OBERON },
  },
  {
    hasMordred: false,
    hasOberon: true,
    hasPercival: true,
    hasMorgana: true,
    expected: { isBalanced: false, message: UBALANCED_TEAM_MESSAGE.WITH_PERCIVAL_OBERON_MORGANA },
  },
  {
    hasMordred: true,
    hasOberon: false,
    hasPercival: false,
    hasMorgana: false,
    expected: { isBalanced: false, message: UBALANCED_TEAM_MESSAGE.ONLY_MORDRED },
  },
  {
    hasMordred: true,
    hasOberon: false,
    hasPercival: false,
    hasMorgana: true,
    expected: { isBalanced: false, message: UBALANCED_TEAM_MESSAGE.WITH_MORDRED_MORGANA },
  },
  {
    hasMordred: true,
    hasOberon: false,
    hasPercival: true,
    hasMorgana: false,
    expected: { isBalanced: true },
  },
  {
    hasMordred: true,
    hasOberon: false,
    hasPercival: true,
    hasMorgana: true,
    expected: { isBalanced: false, message: UBALANCED_TEAM_MESSAGE.WITH_PERCIVAL_MORDRED_MORGANA },
  },
  {
    hasMordred: true,
    hasOberon: true,
    hasPercival: false,
    hasMorgana: false,
    expected: { isBalanced: true },
  },
  {
    hasMordred: true,
    hasOberon: true,
    hasPercival: false,
    hasMorgana: true,
    expected: { isBalanced: true }, // this is balanced because adding Morgana without Percival makes Morgana's power useless
  },
  {
    hasMordred: true,
    hasOberon: true,
    hasPercival: true,
    hasMorgana: false,
    expected: { isBalanced: false, message: UBALANCED_TEAM_MESSAGE.WITH_PERCIVAL_OBERON_MORDRED },
  },
  {
    hasMordred: true,
    hasOberon: true,
    hasPercival: true,
    hasMorgana: true,
    expected: { isBalanced: true },
  },
];
