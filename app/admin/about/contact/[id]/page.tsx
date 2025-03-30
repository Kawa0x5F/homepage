'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Footer from '@/app/component/Footer';
import '@/app/ui/globals.css'

type Contact = {
    id: number;
    name: string;
    link: string;
    has_image: boolean;
  };

type Props = {
  params: { id: number };
};

export default function EditAbout({ params }: Props) {
  const { id } = params;
  const router = useRouter();
  const [about, setAbout] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<Omit<Contact, "id">>({
    name: "",
    link: "",
    has_image: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:8080/contact/${id}`);
        if (res.ok) {
          const data: Contact = await res.json();
          setAbout(data);
          setFormData({
            name: data.name,
            link: data.link,
            has_image: data.has_image || false,
          });
        } else {
          setError("データの取得に失敗しました");
        }
      } catch (err) {
        setError("通信エラーが発生しました");
      }
    }
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/admin/about/contact");
      } else {
        setError("更新に失敗しました");
      }
    } catch (error) {
      setError("通信エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.push("/admin/about");
  };

  if (!about) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">読み込み中...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors duration-200"
            type="button"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">戻る</span>
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              type="button"
            >
              <Save size={16} />
              {isSubmitting ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-3xl mx-auto mt-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="mr-2 text-red-600" size={20} />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-base font-bold mb-3">名前:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-base"
              placeholder="名前を入力"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-base font-bold mb-3">Link:</label>
            <input 
              type="text" 
              name="roma" 
              value={formData.link} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-base"
              placeholder="Linkを入力"
            />
          </div>
        </div>
        <div className="mb-6">
            <div className="flex items-center">
                <input
                type="checkbox"
                id="has_image"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.has_image}
                onChange={(e) => setFormData({...formData, has_image: e.target.checked})}
                />
                <label htmlFor="has_image" className="ml-2 block text-sm font-medium text-gray-700">
                画像あり (画像は /image/{'{name}'}.jpg に配置してください)
                </label>
            </div>
        </div>
      </form>

      <div className="mt-auto">
        <Footer siteName="記事管理システム" adminName="Kawa_" />
      </div>
    </div>
  );
}