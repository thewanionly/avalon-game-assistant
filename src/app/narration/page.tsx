import { NarrationArea } from './NarrationArea';

export default function Narration() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <h1 className="text-2xl">Narration</h1>
      <NarrationArea />
    </div>
  );
}
