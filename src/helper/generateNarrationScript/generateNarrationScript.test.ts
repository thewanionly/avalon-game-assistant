import { generateNarrationScript } from './generateNarrationScript';
import { testCases } from './testCases';

describe('generateNarrationScript', () => {
  it.each(testCases)(
    'should return correct script for hasMordred=%s, hasOberon=%s, hasPercival=%s, hasMorgana=%s',
    ({ hasMordred, hasOberon, hasPercival, hasMorgana, expected }) => {
      const narrationScript = generateNarrationScript({
        hasMordred,
        hasOberon,
        hasPercival,
        hasMorgana,
      });

      expect(narrationScript).toEqual(expected);
    }
  );
});
