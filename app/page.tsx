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
    <main className="relative w-full h-screen flex flex-col items-center justify-center">
      <div className="flex gap-x-12">
        <div className="w-48 h-48 flex flex-col items-center justify-center bg-white shadow-lg rounded-lg hover:shadow-xl transition-all p-4">
          <Link href="/about" className="text-lg font-semibold">ABOUT</Link>
          <p className="text-sm text-gray-600 mt-2">自己紹介や説明のページです。</p>
        </div>
        <div className="w-48 h-48 flex flex-col items-center justify-center bg-white shadow-lg rounded-lg hover:shadow-xl transition-all p-4">
          <Link href="/blog" className="text-lg font-semibold">BLOG</Link>
          <p className="text-sm text-gray-600 mt-2">ブログページです。</p>
        </div>
        <div className="w-48 h-48 flex flex-col items-center justify-center bg-white shadow-lg rounded-lg hover:shadow-xl transition-all p-4">
          <Link href="/product" className="text-lg font-semibold">PRODUCT</Link>
          <p className="text-sm text-gray-600 mt-2">作品を紹介します。</p>
        </div>
      </div>
      <BackgroundText />
    </main>
  );
}
