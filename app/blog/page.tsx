'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  updated_at: string;
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/articles/publish')
      .then((res) => res.json())
      .then((data: unknown) => {
        setArticles(data as Article[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50">
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4">
          <Link href="/blog" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Kawa Blog</h1>
          </Link>
          
          {/* ナビゲーションリンク */}
          <div className="flex space-x-2">
            <Link 
              href="/" 
              className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition"
            >
              TOP
            </Link>
            <Link 
              href="/about" 
              className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition"
            >
              ABOUT
            </Link>
            <Link 
              href="/products" 
              className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition"
            >
              PRODUCT
            </Link>
          </div>
        </div>
      </div>

      {/* ナビゲーションヘッダー */}
      <div className="w-full bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
          <h2 className="text-xl font-semibold">ブログ記事一覧</h2>
        </div>
      </div>

      <div className="w-full max-w-5xl p-4 md:p-6 lg:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">記事を読み込み中...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {articles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="block">
                <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 hover:shadow-lg transition duration-300 h-full flex flex-col">
                  <h2 className="text-xl font-semibold line-clamp-2">{article.title}</h2>
                  <div className="mt-auto pt-4">
                    <p className="text-gray-500 text-sm">
                      更新日: {new Date(article.updated_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white shadow-md rounded-lg p-8 mt-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-gray-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2z" 
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-700">記事がまだありません</h3>
            <p className="text-gray-500 mt-2 text-center">
              最初の記事が公開されるまでお待ちください。
            </p>
          </div>
        )}
      </div>

      <footer className="w-full bg-white border-t mt-auto py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center mb-3">
            <Image
              src="/images/kawa_logo.png"
              alt="Kawa Logo"
              width={40}
              height={40}
              className="rounded-full mr-2"
            />
            <span className="font-medium">Kawa Blog</span>
          </div>
          &copy; {new Date().getFullYear()} Kawa Blog All Rights Reserved.
        </div>
      </footer>
    </main>
  );
}