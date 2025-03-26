'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Footer from "@/app/component/Footer";

interface Article {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  updated_at: string;
}

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`http://localhost:8080/article/${slug}`)
      .then((res) => res.json())
      .then((data: unknown) => {
        setArticle(data as Article);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-2">
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
          <Link href="/blog" className="text-blue-600 hover:underline mr-2">
            ブログ記事一覧
          </Link>
          <span className="text-gray-400 mx-2">{'>'}</span>
          <span className="text-gray-600 truncate">{article?.title || '記事'}</span>
        </div>
      </div>

      {/* 記事コンテンツ */}
      <div className="w-full max-w-3xl p-4 md:p-6 lg:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">記事を読み込み中...</p>
          </div>
        ) : !article ? (
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
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-700">記事が見つかりません</h3>
            <p className="text-gray-500 mt-2 text-center">
              お探しの記事は存在しないか、削除された可能性があります。
            </p>
            <Link href="/blog" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              記事一覧へ戻る
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 md:p-8">
            {/* 記事の画像 */}
            <div className="mb-6">
              <img 
                src={article.image_url || "/images/kawa_logo.jpg"} 
                alt={article.title} 
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>

            {/* 記事タイトルと本文 */}
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            <p className="text-gray-500 text-sm mb-6">
              更新日: {new Date(article.updated_at).toLocaleDateString('ja-JP')}
            </p>
            <div className="prose max-w-none">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>

            {/* 記事一覧への戻るリンク */}
            <div className="mt-8 pt-4 border-t border-gray-100">
              <Link href="/blog" className="text-blue-600 hover:underline flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 19l-7-7 7-7" 
                  />
                </svg>
                記事一覧へ戻る
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* フッター */}
      <Footer siteName="Kawa_ Blog" adminName="Kawa_" />
    </main>
  );
}
