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
    <main className="flex flex-col items-center justify-center p-4">
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
