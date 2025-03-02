import { checkTeamBalance } from './checkTeamBalance';
import { testCases } from './testCases';

describe('checkTeamBalance', () => {
  it.each(testCases)(
    'should return correct result for hasMordred=%s, hasOberon=%s, hasPercival=%s, hasMorgana=%s',
    ({ hasMordred, hasOberon, hasPercival, hasMorgana, expected }) => {
      const actual = checkTeamBalance({
        hasMordred,
        hasOberon,
        hasPercival,
        hasMorgana,
      });

      expect(actual).toEqual(expected);
    }
  );
});
