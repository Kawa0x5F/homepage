'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/app/component/Footer';
import { ArrowLeft } from 'lucide-react';

type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
  is_publish: boolean;
  created_at: string;
};

const AdminArticlePage = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/articles/all');
      const data = await res.json();
      if (Array.isArray(data)) {
        // 作成日順に並び替え（新しい記事が上に表示）
        const sortedArticles = [...data].sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setArticles(sortedArticles as Article[]);
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRedirect = () => {
    router.push('/admin/articles/create');
  };

  const handleEditRedirect = (slug: string) => {
    router.push(`/admin/articles/edit/${slug}`);
  };

  const handleDelete = async (slug: string) => {
    try {
      await fetch(`http://localhost:8080/article/${slug}`, { method: 'DELETE' });
      setDeleteConfirmId(null);
      fetchArticles();
    } catch (error) {
      console.error('削除エラー:', error);
    }
  };

  // 前のページ(/admin)に戻る
  const handleBackToAdmin = () => {
    router.push('/admin');
  };

  // 公開状態を判定する関数
  const getPublicStatusDisplay = (status: boolean) => {
    if (status) { // true の場合
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          公開
        </span>
      );
    } else { // false の場合
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          非公開
        </span>
      );
    }
  };

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToAdmin}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowLeft size={16} className="mr-1" />
                管理ページへ戻る
              </button>
            </div>

            <h1 className="text-xl font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
              記事管理ダッシュボード
            </h1>

            <button
              onClick={handleCreateRedirect}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              新規作成
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900">記事一覧</h2>
            <p className="mt-1 text-sm text-gray-500">記事の編集、削除、または新規作成を行うことができます。記事は作成日順（新しい順）に表示されています。</p>
          </div>
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              <span className="ml-2">読み込み中...</span>
            </div>
          ) : articles.length === 0 ? (
            <div className="py-12 text-center">記事がありません</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">公開状態</th>
                    <th className="relative px-6 py-3"><span className="sr-only">編集</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.slug}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(article.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {getPublicStatusDisplay(article.is_publish)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => handleEditRedirect(article.slug)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md">編集</button>
                        {deleteConfirmId === article.id ? (
                          <span className="inline-flex rounded-md shadow-sm">
                            <button onClick={() => handleDelete(article.slug)} className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md">確認</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="ml-2 text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md">キャンセル</button>
                          </span>
                        ) : (
                          <button onClick={() => setDeleteConfirmId(article.id)} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md">削除</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer siteName="記事管理システム" />
    </div>
  );
};

export default AdminArticlePage;