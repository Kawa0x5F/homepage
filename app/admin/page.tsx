'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '@/app/component/Footer';

const AdminPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:8080/auth/check', { credentials: 'include' });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.push('/login'); // 未認証ならログインページへリダイレクト
        }
      } catch (error) {
        console.error('認証チェックエラー:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) return null; // ロード中は何も表示しない

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6 relative flex items-center justify-center">
          <div className="absolute left-4">
            <a href="/">
              <img 
                src="/images/kawa_logo.png" 
                alt="Kawa Logo" 
                className="h-10 w-auto cursor-pointer" 
              />
            </a>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">管理者ダッシュボード</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard title="自己紹介管理" description="プロフィール情報の編集" color="indigo" path="/admin/aboutme" />
          <DashboardCard title="記事管理" description="ブログ記事の作成・編集" color="green" path="/admin/articles" />
          <DashboardCard title="作品管理" description="ポートフォリオ作品の追加・編集" color="purple" path="/admin/product" />
        </div>
      </main>

      {/* フッター */}
      <Footer siteName="管理者ダッシュボード" />
    </div>
  );
};

const DashboardCard = ({ title, description, color, path }: { title: string, description: string, color: string, path: string }) => {
  const router = useRouter();
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 bg-${color}-500 rounded-md p-3`}>
            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="ml-5">
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => router.push(path)}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-${color}-600 hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500`}
          >
            管理画面へ
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
