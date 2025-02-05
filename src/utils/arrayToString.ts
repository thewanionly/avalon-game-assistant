export const arrayToString = (arr: string[], seprator = ' '): string =>
  arr.filter((s) => s).join(seprator);
