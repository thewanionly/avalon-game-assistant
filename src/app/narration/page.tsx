import { NARRATION } from '@/constants/app';

import { NarrationArea } from './NarrationArea';

export default function Narration() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <h1 className="mb-12 text-2xl">{NARRATION.pageTitle}</h1>
      <NarrationArea />
    </div>
  );
}
