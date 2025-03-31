'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Footer from '@/app/component/Footer';
import '@/app/ui/globals.css'

// AtCoderの色に対応するクラスマップ
const atcoderColorClasses: { [key: string]: string } = {
  black: 'text-gray-900 border-black', // 黒
  gray: 'text-gray-500 border-gray-400', // 灰
  brown: 'text-yellow-700 border-yellow-600', // 茶
  green: 'text-green-500 border-green-400', // 緑
  cyan: 'text-cyan-500 border-cyan-400', // 水色
  blue: 'text-blue-500 border-blue-400', // 青
  yellow: 'text-yellow-500 border-yellow-400', // 黄
  orange: 'text-orange-500 border-orange-400', // 橙
  red: 'text-red-500 border-red-400', // 赤
};

type About = {
  id: number;
  name: string;
  roma: string;
  description: string;
  image_url?: string;
  color?: keyof typeof atcoderColorClasses; // Add color type
};

type Props = {
  params: { id: string };
};

export default function EditAbout({ params }: Props) {
  const { id } = params;
  const router = useRouter();
  const [about, setAbout] = useState<About | null>(null);
  const [formData, setFormData] = useState<Omit<About, "id">>({
    name: "",
    roma: "",
    description: "",
    image_url: "",
    color: "black",
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
        const res = await fetch(`http://localhost:8080/about/${id}`);
        if (res.ok) {
          const data: About = await res.json();
          setAbout(data);
          setFormData({
            name: data.name,
            roma: data.roma,
            description: data.description,
            image_url: data.image_url || "",
            color: data.color || "black",
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
      const res = await fetch(`http://localhost:8080/about/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/admin/about");
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
            <label className="block text-gray-700 text-base font-bold mb-3">ローマ字:</label>
            <input 
              type="text" 
              name="roma" 
              value={formData.roma} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-base"
              placeholder="ローマ字を入力"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-base font-bold mb-3">説明:</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-40 transition-all duration-200 resize-y text-base"
            placeholder="説明を入力"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-base font-bold mb-3">画像URL:</label>
          <input 
            type="text" 
            name="image_url" 
            value={formData.image_url} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-base"
            placeholder="画像URLを入力 (オプション)"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-base font-bold mb-3">色:</label>
          <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-base appearance-none bg-white"
            >
            {Object.keys(atcoderColorClasses).map((color) => (
                <option key={color} value={color}>
                {color === 'black' ? '黒' :
                color === 'gray' ? '灰' :
                color === 'brown' ? '茶' :
                color === 'green' ? '緑' :
                color === 'cyan' ? '水色' :
                color === 'blue' ? '青' :
                color === 'yellow' ? '黄' :
                color === 'orange' ? '橙' :
                color === 'red' ? '赤' : color}
                </option>
            ))}
            </select>
        </div>
      </form>

      <div className="mt-auto">
        <Footer siteName="記事管理システム" adminName="Kawa_" />
      </div>
    </div>
  );
}