'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  content: string;
  date: string;
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/articles')
      .then((res) => res.json())
      .then((data: unknown) => {
        setArticles(data as Article[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-5xl text-center sticky top-0 bg-white py-4 shadow-md">
        <h1 className="text-3xl font-bold">ブログ記事一覧</h1>
      </div>
      {loading ? (
        <p className="mt-6">記事を読み込み中...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`} className="block">
              <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 hover:bg-gray-100 transition">
                <h2 className="text-xl font-semibold">{article.title}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(article.date).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Link href="/" className="mt-6 text-blue-600 hover:underline">
        メインページへ戻る
      </Link>
    </main>
  );
}
