const conditionalString = (condition: boolean, str: string) => (condition ? str : '');

type NarrationScriptOptions = {
  hasMordred?: boolean;
  hasOberon?: boolean;
  hasPercival?: boolean;
  hasMorgana?: boolean;
};

export const generateNarrationScript = (options?: NarrationScriptOptions): string => {
  const {
    hasMordred = false,
    hasOberon = false,
    hasPercival = false,
    hasMorgana = false,
  } = options ?? {};

  const percivalScript = `
    Merlin${conditionalString(hasMorgana, ` and Morgana`)}, extend your thumb so that Percival may know of you.
    Percival, open your eyes so you may know Merlin${conditionalString(hasMorgana, ` and Morgana`)}.
    Merlin${conditionalString(hasMorgana, ` and Morgana`)}, put your thumbs down and form your hand into a fist.
    Percival, close your eyes.
    All players should have their eyes closed and hands in a fist in front of them.
  `;

  const narrationScript = `
    Everyone, close your eyes and extend your hand into a fist in front of you.
    Minions of Mordred,${conditionalString(hasOberon, ` not Oberon,`)} open your eyes and look around so that you know all agents of Evil.
    Minions of Mordred, close your eyes.
    All players should have their eyes closed and hands in a fist in front of them.
    Minions of Mordred,${conditionalString(hasMordred, ` not Mordred himself,`)} extend your thumb so that Merlin will know of you.
    Merlin, open your eyes and see the agents of Evil.
    Minions of Mordred, put your thumbs down and re-form your hand into a fist.
    Merlin, close your eyes.
    All players should have their eyes closed and hands in a fist in front of them.
    ${conditionalString(hasPercival, percivalScript)}
    Everyone, open your eyes.
  `;

  return narrationScript;
};
