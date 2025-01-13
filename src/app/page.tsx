import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { APP_TITLE } from '@/constants/app';

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8">
        <h1 className="text-3xl">{APP_TITLE}</h1>
        <Button asChild>
          <Link href="/narration">Narration</Link>
        </Button>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6"></footer>
    </div>
  );
}
