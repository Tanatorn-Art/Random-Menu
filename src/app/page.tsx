

'use client';

import dynamic from 'next/dynamic';

const Random_mainpage = dynamic(() => import('@/components/Random_mainpage'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <div className="space-y-6">
        <Random_mainpage/>
      </div>
    </div>
  );
}
