'use client';

import { APP_TITLE } from '@/constants/app';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  if (isHome) return null;

  return (
    <header className="sticky top-0 flex justify-center bg-background p-6">
      <Link className="text-2xl" href="/">
        {APP_TITLE}
      </Link>
    </header>
  );
};
