'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/ui/globals.css';

type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
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
      const res = await fetch('http://localhost:8080/articles');
      const data = await res.json();
      if (Array.isArray(data)) {
        setArticles(data as Article[]);
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">記事管理ダッシュボード</h1>
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
            <p className="mt-1 text-sm text-gray-500">記事の編集、削除、または新規作成を行うことができます。</p>
          </div>
          {isLoading ? (
            <div className="py-12 flex justify-center">Loading...</div>
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
                    <th className="relative px-6 py-3"><span className="sr-only">編集</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.slug}</td>
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
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">記事管理システム &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminArticlePage;
