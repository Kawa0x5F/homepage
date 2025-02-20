import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import BackgroundText from './component/BackgroundText'
import './ui/globals.css'


export const metadata: Metadata = {
  title: 'Kawa_Web',
  description: 'Kawa_のホームページです.',
}

export default function Home() {
  return (
    <main className="relative w-full h-screen flex items-center justify-center">
      <div>
        <Link href="/about">ABOUT</Link><br />
      </div>
      <BackgroundText />
    </main>
  );
}
