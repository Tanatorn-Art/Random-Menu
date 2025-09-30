'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Loading from '@/components/loading/Loading';

const RandomYesNoPage = dynamic(() => import('@/components/Random_yes_no_page'), { ssr: false });

export default function RandomYesNo() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };
    loadData();
  }, []);
  return (
    <div className="min-h-screen w-full">
      <div className="space-y-6">
        {loading ? <Loading theme="yesno" /> : <RandomYesNoPage/>}
      </div>
    </div>
  );
}
