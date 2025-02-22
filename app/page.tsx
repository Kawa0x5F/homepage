import type { Metadata } from 'next'
import Link from 'next/link'
import BackgroundText from './component/BackgroundText'
import './ui/globals.css'


export const metadata: Metadata = {
  title: 'Kawa_Web',
  description: 'Kawa_のホームページです.',
}

export default function Home() {
  return (
    <main className="relative w-full h-screen flex flex-col items-center justify-center">
      <div className="flex gap-x-6">
        <Link href="/about" className="px-6 py-3 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all">
          ABOUT
        </Link>
        <Link href="/blog" className="px-6 py-3 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all">
          BLOG
        </Link>
        <Link href="/product" className="px-6 py-3 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all">
          PRODUCT
        </Link>
      </div>
      <BackgroundText />
    </main>
  );
}

