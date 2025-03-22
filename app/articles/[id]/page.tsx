'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  content: string;
  updated_at: string;
}

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/article/${id}`)
      .then((res) => res.json())
      .then((data: unknown) => {
        setArticle(data as Article);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-center mt-6">記事を読み込み中...</p>;
  }

  if (!article) {
    return <p className="text-center mt-6">記事が見つかりません。</p>;
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-gray-500 text-sm mb-6">{new Date(article.updated_at).toLocaleDateString()}</p>
      <div className="prose">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
      <Link href="/blog" className="block mt-6 text-blue-600 hover:underline">
        記事一覧へ戻る
      </Link>
    </main>
  );
}
