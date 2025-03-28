'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Footer from '@/app/component/Footer';

type About = {
  id: number;
  name: string;
  roma: string;
  description: string;
  image_url?: string;
  color?: string;
  created_at: string;
  updated_at: string;
};

// AtCoderの色に対応するクラスマップ
const atcoderColorClasses: { [key: string]: string } = {
  black: 'text-gray-900 border-black', // 黒
  gray: 'text-gray-500 border-gray-400', // 灰
  brown: 'text-yellow-700 border-yellow-600', // 茶
  green: 'text-green-500 border-green-400', // 緑
  cyan: 'text-cyan-500 border-cyan-400', // 水色
  blue: 'text-blue-500 border-blue-400', // 青
  yellow: 'text-yellow-500 border-yellow-400', // 黄
  orange: 'text-orange-500 border-orange-400', // 橙
  red: 'text-red-500 border-red-400', // 赤
};

export default function About({ id = 1 }: { id?: number }) {
  const [profile, setProfile] = useState<About | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/about/${id}`)
      .then((res) => res.json())
      .then((data: unknown) => {
        if (typeof data === 'object' && data !== null && 'id' in data) {
          setProfile(data as About);
        }
      })
      .catch((error) => console.error('Error fetching profile:', error));
  }, [id]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  // 画像のURL
  const imageUrl = profile.image_url && profile.image_url.startsWith('http')
    ? profile.image_url
    : profile.image_url
    ? `/${profile.image_url}`
    : '/images/portfolio_photo.jpg';

  // AtCoderの色を取得（デフォルト: gray）
  const colorClass = profile.color && atcoderColorClasses[profile.color] ? atcoderColorClasses[profile.color] : atcoderColorClasses.gray;

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

      {/* Profile Section */}
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="max-w-4xl mx-auto grid md:grid-cols-[auto_1fr] gap-12 items-center">
          <Image 
            src={imageUrl}
            alt={`${profile.name}のプロフィール画像`}
            width={240}
            height={240}
            className={`rounded-xl shadow-2xl object-cover border-4 ${colorClass}`}
          />
          <div>
            <div className="mb-6">
              <h2 className={`text-5xl font-bold ${colorClass} mb-2`}>{profile.name}</h2>
              <p className="text-neutral-600 text-lg tracking-wider">{profile.roma}</p>
            </div>
            <div className={`h-1.5 w-24 ${colorClass} mb-6`}></div>
            <p className="text-neutral-700 text-xl leading-relaxed whitespace-pre-line">
              {profile.description}
            </p>
          </div>
        </div>
      </div>

      <Footer siteName="Kawa_ About" adminName="川﨑祐一" />
    </main>
  );
}
