import type { Metadata } from 'next';
import Link from 'next/link';
import BackgroundText from './component/BackgroundText';
import './ui/globals.css';
import CardItem from './component/CardItem';

export const metadata: Metadata = {
  title: 'Kawa_Web',
  description: 'Kawa_のホームページです.',
};

export default function Home() {
  const cards = [
    { title: 'ABOUT', desc: '自己紹介ページです。', href: '/about', icon: '👤' },
    { title: 'BLOG', desc: 'ブログページです。', href: '/blog', icon: '📝' },
    { title: 'PRODUCT', desc: '作品紹介ページです。', href: '/product', icon: '🎨' }
  ];

  return (
    <main className="relative w-full h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <Link 
        href="/login" 
        className="absolute top-4 right-4 w-6 h-6 rounded-full opacity-10 hover:opacity-80 transition-opacity duration-300"
        aria-label="隠しログインボタン"
      >
        <div className="w-full h-full bg-gray-400 rounded-full"></div>
      </Link>

      {/* メインコンテンツ */}
      <div className="relative z-10 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-900 mb-2">
          Kawa_Web
        </h1>
        <p className="text-sm md:text-base text-center text-gray-600">
          ようこそ、Kawa_のWebサイトへ
        </p>
      </div>

      <div className="flex flex-row flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 z-10">
        {cards.map((item) => (
          <CardItem 
            key={item.title}
            title={item.title}
            description={item.desc}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </div>

      {/* 装飾要素
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-indigo-100 to-transparent opacity-70"></div> */}
      
      <BackgroundText />
    </main>
  );
}