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
      <div>
        <Link href="/about">ABOUT</Link>
      </div>
      <div>
        <Link href="/blog">BLOG</Link>
      </div>
      <BackgroundText />
    </main>
  );
}
