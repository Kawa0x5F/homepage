'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/app/component/Footer';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import '@/app/ui/globals.css'

type SkillType = "Language" | "FrameWorks" | "Tools";

type Skill = {
  id: number;
  name: string;
  type: SkillType;
  has_image: boolean;
  created_at: string;
};

type ErrorData = {
    message?: string;
}

const AdminSkillsPage = () => {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState<{
    name: string;
    type: SkillType;
    has_image: boolean;
  }>({
    name: '',
    type: 'Language',
    has_image: false
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

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
      fetchSkills();
    }
  }, [isAuthenticated]);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/skills/all', { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) {
        const sortedSkills = [...data].sort((a, b) => a.id - b.id);
        setSkills(sortedSkills as Skill[]);
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToAdmin = () => {
    router.push('/admin/about');
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!newSkill.name.trim()) {
      setError('スキル名を入力してください');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/skills', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSkill),
      });

      if (res.ok) {
        setSuccess('スキルを追加しました');
        setNewSkill({
          name: '',
          type: 'Language',
          has_image: false
        });
        setIsAdding(false);
        fetchSkills();
      } else {
        const errorData = await res.json() as ErrorData;
        setError(`エラー: ${errorData.message || 'スキルの追加に失敗しました'}`);
      }
    } catch (err) {
      console.error(err);
      setError('エラー: サーバーとの通信に失敗しました');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('本当にこのスキルを削除しますか？')) return;

    setError('');
    setSuccess('');

    try {
      const res = await fetch(`http://localhost:8080/skills/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setSuccess('スキルを削除しました');
        fetchSkills();
      } else {
        const errorData = await res.json() as ErrorData;
        setError(`エラー: ${errorData.message || 'スキルの削除に失敗しました'}`);
      }
    } catch (err) {
      console.error(err);
      setError('エラー: サーバーとの通信に失敗しました');
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
                プロフィール管理へ戻る
              </button>
            </div>

            <h1 className="text-xl font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
              スキル管理
            </h1>
          </div>
        </div>
      </header>
      
      <main className="flex-grow max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={16} className="mr-2" />
            新規スキル追加
          </button>
        </div>

        {isAdding && (
          <div className="bg-white shadow sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                新規スキル追加
              </h3>
              <div className="mt-5">
                <form onSubmit={handleAddSkill} className="space-y-6">
                  <div>
                    <label htmlFor="skillName" className="block text-sm font-medium text-gray-700">
                      スキル名
                    </label>
                    <input
                      type="text"
                      name="skillName"
                      id="skillName"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="skillType" className="block text-sm font-medium text-gray-700">
                      タイプ
                    </label>
                    <select
                      id="skillType"
                      name="skillType"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={newSkill.type}
                      onChange={(e) => setNewSkill({ ...newSkill, type: e.target.value as SkillType })}
                    >
                      <option value="Language">Language</option>
                      <option value="FrameWorks">FrameWorks</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="hasImage"
                      name="hasImage"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={newSkill.has_image}
                      onChange={(e) => setNewSkill({ ...newSkill, has_image: e.target.checked })}
                    />
                    <label htmlFor="hasImage" className="ml-2 block text-sm text-gray-900">
                      画像あり
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      追加
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900">スキル一覧</h2>
            <p className="mt-1 text-sm text-gray-500">登録されているスキルの一覧です。</p>
          </div>
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              <span className="ml-2">読み込み中...</span>
            </div>
          ) : skills.length === 0 ? (
            <div className="py-12 text-center">登録されているスキルはありません</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">スキル名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイプ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">画像</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">登録日</th>
                    <th className="relative px-6 py-3"><span className="sr-only">削除</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {skills.map((skill) => (
                    <tr key={skill.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{skill.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{skill.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{skill.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {skill.has_image ? '有り' : '無し'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(skill.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md inline-flex items-center"
                        >
                          <Trash2 size={16} className="mr-1" />
                          削除
                        </button>
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

export default AdminSkillsPage;