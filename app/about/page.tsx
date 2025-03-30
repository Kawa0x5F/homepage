'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import Footer from '@/app/component/Footer';
import '@/app/ui/globals.css'

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

type SkillType = "Language" | "FrameWorks" | "Tools";

type Skill = {
  id: number;
  name: string;
  type: SkillType;
  has_image: boolean;
  created_at: string;
};

type Contact = {
  id: number;
  name: string;
  link: string;
  has_image: boolean;
  created_at: string;
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

export default function About() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ? Number(searchParams.get('id')) : 1;

  const [profile, setProfile] = useState<About | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  function isAbout(data: any): data is About {
    return data && typeof data.id === 'number' && typeof data.name === 'string';
  }

  useEffect(() => {
    // 最初に指定された id を使ってデータをフェッチ
    const fetchProfile = async (profileId: number) => {
      try {
        const res = await fetch(`http://localhost:8080/about/${profileId}`);
        const data = await res.json();
        
        if (isAbout(data)) {
          setProfile(data);
        } else {
          // データが無ければ id=1 のデータを再度フェッチ
          const fallbackRes = await fetch('http://localhost:8080/about/1');
          const fallbackData = await fallbackRes.json();
          setProfile(fallbackData as About);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchSkills = async () => {
      try {
        const res = await fetch('http://localhost:8080/skills/all');
        const data = await res.json();
        setSkills((data ?? []) as Skill[]);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
    
    const fetchContacts = async () => {
      try {
        const res = await fetch('http://localhost:8080/contact/all');
        const data = await res.json();
        setContacts((data ?? []) as Contact[]);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProfile(id),
        fetchSkills(),
        fetchContacts()
      ]);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading || !profile) {
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

  // スキルをタイプ別にグループ化
  const groupedSkills: Record<SkillType, Skill[]> = {
    "Language": skills.filter(skill => skill.type === "Language"),
    "FrameWorks": skills.filter(skill => skill.type === "FrameWorks"),
    "Tools": skills.filter(skill => skill.type === "Tools")
  };

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
            className={`rounded-xl shadow-2xl object-cover`}
            priority
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

      {/* Skills Section */}
      <div className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Skills</h2>
          
          {Object.entries(groupedSkills).map(([type, typeSkills]) => (
            <div key={type} className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-700 mb-6">{type}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {typeSkills.map(skill => (
                  <div key={skill.id} className="flex flex-col items-center">
                    <p 
                     className="px-4 py-2 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all"
                    >
                      {skill.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Contact</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {contacts.map(contact => (
              <a 
                key={contact.id} 
                href={contact.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-2">
                  <Image
                    src={contact.has_image ? `/images/${contact.name}.svg` : '/images/noImage.svg'}
                    alt={contact.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <p className="text-center text-gray-700">{contact.name}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      <Footer siteName="Kawa_ About" adminName="川﨑祐一" />
    </main>
  );
}