import type { Metadata } from 'next';
import Link from 'next/link';
import BackgroundText from './component/BackgroundText';
import './ui/globals.css';

export const metadata: Metadata = {
  title: 'Kawa_Web',
  description: 'Kawa_のホームページです.',
};

export default function Home() {
  return (
    <main className="relative w-full h-screen flex flex-col items-center justify-center p-4">
      <div className="flex flex-row flex-wrap justify-center gap-2 sm:gap-4 md:gap-x-12">
        <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 flex flex-col items-center justify-center bg-white shadow-lg rounded-lg hover:shadow-xl transition-all p-3">
          <Link href="/about" className="text-sm sm:text-base md:text-lg font-semibold">ABOUT</Link>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">自己紹介や説明のページです。</p>
        </div>
        <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 flex flex-col items-center justify-center bg-white shadow-lg rounded-lg hover:shadow-xl transition-all p-3">
          <Link href="/blog" className="text-sm sm:text-base md:text-lg font-semibold">BLOG</Link>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">ブログページです。</p>
        </div>
        <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 flex flex-col items-center justify-center bg-white shadow-lg rounded-lg hover:shadow-xl transition-all p-3">
          <Link href="/product" className="text-sm sm:text-base md:text-lg font-semibold">PRODUCT</Link>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">作品を紹介します。</p>
        </div>
      </div>
      <BackgroundText />
    </main>
  );
}
