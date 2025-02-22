import type { Metadata } from 'next'
import Link from 'next/link'
import './../ui/globals.css'

export const metadata: Metadata = {
  title: 'Kawa_Web - Blog',
  description: 'Kawa_のブログページ（開発中）',
};

export default function Blog() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h2 className="text-2xl font-semibold">このページは現在開発中です。</h2>
      <p className="mt-2 text-gray-600">しばらくお待ちください。</p>
      <Link 
        href="/" 
        className="mt-6 px-4 py-2 "
      >
        メインページへ戻る
      </Link>
    </main>
  );
}
