import { arrayToString } from '@/utils/arrayToString';

export const INTRO = 'Everyone, close your eyes and extend your hand into a fist in front of you.';

// Minions of Mordred
export const MINIONS_OF_MORDRED_SCRIPT = arrayToString([
  'Minions of Mordred, open your eyes and look around so that you know all agents of Evil.',
  'Minions of Mordred, close your eyes.',
]);
export const MINIONS_OF_MORDRED_WITH_OBERON_SCRIPT = arrayToString([
  'Minions of Mordred, not Oberon, open your eyes and look around so that you know all agents of Evil.',
  'Minions of Mordred, close your eyes.',
]);

// Merlin
export const MERLIN_SCRIPT = arrayToString([
  'Minions of Mordred, extend your thumb so that Merlin will know of you.',
  'Merlin, open your eyes and see the agents of Evil.',
  'Minions of Mordred, put your thumbs down and re-form your hand into a fist.',
  ' Merlin, close your eyes.',
]);
export const MERLIN_WITH_MORDRED_SCRIPT = arrayToString([
  'Minions of Mordred, not Mordred himself, extend your thumb so that Merlin will know of you.',
  'Merlin, open your eyes and see the agents of Evil.',
  'Minions of Mordred, put your thumbs down and re-form your hand into a fist.',
  ' Merlin, close your eyes.',
]);

export const ALL_PLAYERS_HANDS_CLOSED_HANDS_FIST =
  'All players should have their eyes closed and hands in a fist in front of them.';

// Percival
export const PERCIVAL_SCRIPT = arrayToString([
  'Merlin, extend your thumb so that Percival may know of you.',
  'Percival, open your eyes so you may know Merlin.',
  'Merlin, put your thumbs down and form your hand into a fist.',
  'Percival, close your eyes.',
  ALL_PLAYERS_HANDS_CLOSED_HANDS_FIST,
]);
export const PERCIVAL_WITH_MORGANA_SCRIPT = arrayToString([
  'Merlin and Morgana, extend your thumb so that Percival may know of you.',
  'Percival, open your eyes so you may know Merlin and Morgana.',
  'Merlin and Morgana, put your thumbs down and form your hand into a fist.',
  'Percival, close your eyes.',
  ALL_PLAYERS_HANDS_CLOSED_HANDS_FIST,
]);

export const CLOSING = 'Everyone, open your eyes.';
