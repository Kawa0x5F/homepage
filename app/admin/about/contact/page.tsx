'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/app/component/Footer';
import { ArrowLeft, Plus } from 'lucide-react';
import '@/app/ui/globals.css'

type Contact = {
  id: number;
  name: string;
  link: string;
  has_image: boolean;
  created_at: string;
};

const AdminContactPage = () => {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    link: '',
    has_image: false
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      fetchContacts();
    }
  }, [isAuthenticated]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/contact/all', { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) {
        const sortedContacts = [...data].sort((a, b) => a.id - b.id);
        setContacts(sortedContacts as Contact[]);
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
    router.push(`/admin/about/contact/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('本当にこのコンタクトを削除しますか？')) return;
    
    try {
      const res = await fetch(`http://localhost:8080/contact/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (res.ok) {
        // 削除成功
        fetchContacts();
      } else {
        console.error('削除エラー:', await res.text());
      }
    } catch (error) {
      console.error('削除処理中にエラーが発生しました:', error);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:8080/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newContact)
      });
      
      if (res.ok) {
        // 追加成功
        setIsAddModalOpen(false);
        setNewContact({
          name: '',
          link: '',
          has_image: false
        });
        fetchContacts();
      } else {
        const errorText = await res.text();
        setError(`追加エラー: ${errorText}`);
      }
    } catch (error) {
      console.error('追加処理中にエラーが発生しました:', error);
      setError('追加処理中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 前のページ(/admin)に戻る
  const handleBackToAdmin = () => {
    router.push('/admin/about');
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
                プロフィール管理へ戻る
              </button>
            </div>

            <h1 className="text-xl font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
              コンタクト管理ダッシュボード
            </h1>
          </div>
        </div>
      </header>
      
      <main className="flex-grow max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={16} className="mr-2" />
            コンタクトを追加
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900">コンタクト一覧</h2>
            <p className="mt-1 text-sm text-gray-500">コンタクト情報の追加・削除を行うことができます。</p>
          </div>
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              <span className="ml-2">読み込み中...</span>
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-12 text-center">コンタクト情報がありません</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">リンク</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">画像</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
                    <th className="relative px-6 py-3"><span className="sr-only">アクション</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        <a href={contact.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 hover:underline">
                          {contact.link}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contact.has_image ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            あり
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            なし
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(contact.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleEditRedirect(contact.id)} 
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md"
                      >
                        編集
                      </button>

                      {deleteConfirmId === contact.id ? (
                        <span className="inline-flex rounded-md shadow-sm space-x-2">
                          <button 
                            onClick={() => handleDelete(contact.id)} 
                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
                          >
                            確認
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(null)} 
                            className="text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
                          >
                            キャンセル
                          </button>
                        </span>
                      ) : (
                        <button 
                          onClick={() => setDeleteConfirmId(contact.id)} 
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md"
                        >
                          削除
                        </button>
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

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">新しいコンタクトを追加</h3>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleAddContact}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                  リンク <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="link"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={newContact.link}
                  onChange={(e) => setNewContact({...newContact, link: e.target.value})}
                />
              </div>
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="has_image"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={newContact.has_image}
                    onChange={(e) => setNewContact({...newContact, has_image: e.target.checked})}
                  />
                  <label htmlFor="has_image" className="ml-2 block text-sm font-medium text-gray-700">
                    画像あり (画像は /image/{'{name}'}.jpg に配置してください)
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '送信中...' : '追加する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer siteName="コンタクト管理システム" adminName="Kawa_" />
    </div>
  );
};

export default AdminContactPage;