export const transformNarrationScript = (narrationScript: string): string[] => {
  if (!narrationScript) return [];

  return narrationScript
    .split(/\. |\./)
    .filter((v) => v)
    .map((v) => `"${v}."`);
};
