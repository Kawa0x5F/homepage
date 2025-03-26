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
  created_at: string;
  updated_at: string;
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

  const imageUrl = profile.image_url && profile.image_url.startsWith('http')
    ? profile.image_url
    : profile.image_url
    ? `/${profile.image_url}`
    : '/images/portfolio_photo.jpg';

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

      {/* Profile Section - Enhanced */}
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="max-w-4xl mx-auto grid md:grid-cols-[auto_1fr] gap-12 items-center">
          <Image 
            src={imageUrl}
            alt={`${profile.name}のプロフィール画像`}
            width={240}  // Increased from 160
            height={240} // Increased from 160
            className="rounded-xl shadow-2xl object-cover border-4 border-emerald-400"
          />
          <div>
            <div className="mb-6">
              <h2 className="text-5xl font-bold text-emerald-500 mb-2">{profile.name}</h2>
              <p className="text-neutral-600 text-lg tracking-wider">{profile.roma}</p>
            </div>
            <div className="h-1.5 w-24 bg-emerald-400 mb-6"></div>
            <p className="text-neutral-700 text-xl leading-relaxed">
              {profile.description}
            </p>
          </div>
        </div>
      </div>

      <Footer siteName="Kawa_ About" adminName="川﨑祐一" />
    </main>
  );
}