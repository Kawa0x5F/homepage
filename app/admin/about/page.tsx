'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/app/component/Footer';
import { ArrowLeft, Briefcase, MessageCircle } from 'lucide-react';
import '@/app/ui/globals.css'

type About = {
  id: number;
  name: string;
  roma: string;
  description: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
};

const AdminAboutPage = () => {
  const router = useRouter();
  const [abouts, setAbouts] = useState<About[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      fetchAbouts();
    }
  }, [isAuthenticated]);

  const fetchAbouts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/about/all', { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) {
        const sortedAbouts = [...data].sort((a, b) => a.id - b.id);
        setAbouts(sortedAbouts as About[]);
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRedirect = (id: number) => {
    router.push(`/admin/about/edit/${id}`);
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
              プロフィール管理ダッシュボード
            </h1>
          </div>
        </div>
      </header>
      
      <main className="flex-grow max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="mb-4 flex justify-end space-x-2">
          <button
            onClick={() => router.push('/admin/edit/skills')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Briefcase size={16} className="mr-2" />
            スキル管理
          </button>
          <button
            onClick={() => router.push('/admin/edit/contact')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <MessageCircle size={16} className="mr-2" />
            コンタクト管理
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900">プロフィール一覧</h2>
            <p className="mt-1 text-sm text-gray-500">プロフィールの編集を行うことができます。</p>
          </div>
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              <span className="ml-2">読み込み中...</span>
            </div>
          ) : abouts.length === 0 ? (
            <div className="py-12 text-center">プロフィールがありません</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新日</th>
                    <th className="relative px-6 py-3"><span className="sr-only">編集</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {abouts.map((about) => (
                    <tr key={about.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{about.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{about.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(about.updated_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => handleEditRedirect(about.id)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md">編集</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer siteName="自己紹介管理システム" adminName="Kawa_" />
    </div>
  );
};

export default AdminAboutPage;