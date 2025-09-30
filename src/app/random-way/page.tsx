'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Loading from '@/components/loading/Loading';

const RandomWayPage = dynamic(() => import('@/components/Random_way_page'), { ssr: false });

export default function RandomWay() {
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
        {loading ? <Loading theme="way" /> : <RandomWayPage/>}
      </div>
    </div>
  );
}
