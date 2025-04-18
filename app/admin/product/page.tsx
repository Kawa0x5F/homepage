'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/app/component/Footer';
import { ArrowLeft } from 'lucide-react';
import '@/app/ui/globals.css'

type Product = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  github: boolean;
  blog: string;
  created_at: string;
  updated_at: string;
};

const AdminArticlePage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:8080/auth/check', { credentials: 'include' });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/login');
        }
      } catch (error) {
        console.error('認証チェックエラー:', error);
        setIsAuthenticated(false);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles();
    }
  }, [isAuthenticated]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/product/all', { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) {
        const sortedProducts = [...data].sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setProducts(sortedProducts as Product[]);
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
    router.push('/admin/product/create');
  };

  const handleEditRedirect = (id: number) => {
    router.push(`/admin/product/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const productData = products.find(product => product.id === id);
      if (!productData) {
        throw new Error('対象の記事が見つかりません');
      }

      const deleteProductRes = await fetch(`http://localhost:8080/product/${id}`, { 
        method: 'DELETE', 
        credentials: 'include' 
      });

      if (!deleteProductRes.ok) {
        throw new Error('記事の削除に失敗しました');
      }

      if (productData.image_url) {
        console.log('Attempting to delete image:', productData.image_url);
        const deleteImageRes = await fetch('http://localhost:8080/image', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ image_url: productData.image_url })
        });

        if (!deleteImageRes.ok) {
          throw new Error('画像の削除に失敗しました');
        }
      }

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
              作品管理ダッシュボード
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
            <h2 className="text-lg leading-6 font-medium text-gray-900">作品一覧</h2>
            <p className="mt-1 text-sm text-gray-500">作品紹介の編集、削除、または新規作成を行うことができます。作成日順（新しい順）に表示されています。</p>
          </div>
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              <span className="ml-2">読み込み中...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">作品がありません</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最終更新日</th>
                    <th className="relative px-6 py-3"><span className="sr-only">編集</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(product.updated_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => handleEditRedirect(product.id)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md">編集</button>
                        {deleteConfirmId === product.id ? (
                          <span className="inline-flex rounded-md shadow-sm">
                            <button onClick={() => handleDelete(product.id)} className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md">確認</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="ml-2 text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md">キャンセル</button>
                          </span>
                        ) : (
                          <button onClick={() => setDeleteConfirmId(product.id)} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md">削除</button>
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
      <Footer siteName="作品管理システム" adminName="Kawa_" />
    </div>
  );
};

export default AdminArticlePage;