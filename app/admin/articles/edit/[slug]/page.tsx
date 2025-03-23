'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import '@/app/ui/globals.css';

type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
};

const EditArticlePage = () => {
  const router = useRouter();
  const { slug } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:8080/article/${slug}`);
        if (!res.ok) {
          throw new Error('記事の取得に失敗しました');
        }
        const data: Article = await res.json();
        if (data) {
          setTitle(data.title);
          setContent(data.content);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchArticle();
  }, [slug]);

  const handleUpdate = async () => {
    if (!title || !content) return;
    setIsSubmitting(true);
    try {
      await fetch(`http://localhost:8080/article/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      router.push('/admin/articles');
    } catch (error) {
      console.error('更新エラー:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="w-full border-b border-gray-100 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <button onClick={() => router.push('/admin/articles')} className="text-gray-500 hover:text-gray-900 text-sm font-medium">
            キャンセル
          </button>
          <div className="flex space-x-6">
            <span className={`cursor-pointer text-sm font-medium ${isPreview ? 'text-gray-400' : 'text-gray-900 border-b-2 border-gray-900'} py-2`} onClick={() => setIsPreview(false)}>
              編集
            </span>
            <span className={`cursor-pointer text-sm font-medium ${isPreview ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400'} py-2`} onClick={() => setIsPreview(true)}>
              プレビュー
            </span>
          </div>
          <button
            onClick={handleUpdate}
            disabled={isSubmitting || !title || !content}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isSubmitting || !title || !content
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isSubmitting ? '更新中...' : '更新する'}
          </button>
        </div>
      </header>

      {/* 記事編集エリア */}
      <main className="w-full max-w-2xl mx-auto px-4 py-8 flex-grow">
        <div className="h-[calc(100vh-150px)] overflow-y-auto">
          {isPreview ? (
            <div className="h-full">
              <h1 className="text-3xl font-bold mb-6 text-gray-900">{title || 'タイトルなし'}</h1>
              <p className="text-gray-500">/{slug}</p>
              <div className="prose max-w-none">
                {content ? (
                  <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                  <p className="text-gray-400 italic">本文を入力するとプレビューが表示されます</p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <input
                type="text"
                placeholder="タイトル"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-bold mb-4 focus:outline-none border-0 text-gray-900 placeholder-gray-300"
              />
              <p className="text-gray-500 text-sm">Slug: {slug}</p>
              <textarea
                placeholder="本文をMarkdown形式で入力してください..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full flex-grow focus:outline-none border-0 resize-none text-gray-800 placeholder-gray-300 text-lg leading-relaxed"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditArticlePage;
