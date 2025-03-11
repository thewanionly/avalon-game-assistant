import { cookies } from 'next/headers';

import { SELECTED_CHARACTERS_COOKIE } from '@/constants/storage';
import { NarrationArea } from './NarrationArea';

export default async function Narration() {
  const savedSelectedCharacters = (await cookies()).get(SELECTED_CHARACTERS_COOKIE);
  const defaultSelectedCharacters =
    savedSelectedCharacters?.value && JSON.parse(savedSelectedCharacters.value);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <NarrationArea defaultSelectedCharacters={defaultSelectedCharacters} />
    </div>
  );
}
