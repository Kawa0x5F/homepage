import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import './../ui/globals.css'

export const metadata: Metadata = {
  title: 'Kawa_Web',
  description: 'Kawa_のホームページです.',
}

export default function About() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4">
          <Link href="/blog" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Kawa About</h1>
          </Link>
          <div className="flex space-x-2">
            <Link href="/" className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition">TOP</Link>
            <Link href="/blog" className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition">BLOG</Link>
            <Link href="/products" className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition">PRODUCT</Link>
          </div>
        </div>
      </div>
      <div className="w-full max-w-3xl bg-orange-50 rounded-lg p-6 shadow-md">
        <h1 className="text-xl font-bold text-gray-800">About me</h1>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-4">
          <Image 
            src="/snsProfile.png"
            alt="Kawa_Cat. This icon is used by Kawa_ on SNS."
            width={512}
            height={512}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full"
          />
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold">Kawa_</h2>
            <p className="text-gray-600">AtCoder 茶</p>
            <p className="text-gray-600 italic">「努力はしないと始まらない」</p>
          </div>
        </div>
        <div className="mt-4 text-center md:text-left">
          <a href="https://x.com/kawa0x5f" className="text-blue-500 hover:underline block">Twitter</a>
          <a href="https://atcoder.jp/user/Kawa_" className="text-blue-500 hover:underline block">AtCoder</a>
          <a href="https://github.com/Kawa0x5F" className="text-blue-500 hover:underline block">GitHub</a>
          <a href="https://www.facebook.com/share/1526jPNvPN/" className="text-blue-500 hover:underline block">FaceBook</a>
        </div>
      </div>
      <Link 
        href="/" 
        className="mt-6 px-4 py-2 "
      >
        メインページへ戻る
      </Link>
    </main>
  );
}
