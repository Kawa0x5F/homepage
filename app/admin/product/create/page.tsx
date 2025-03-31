'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon,
  X,
  AlertCircle,
  Github,
  FileText
} from 'lucide-react';
import '@/app/ui/globals.css'

// 型定義
interface FeaturedImage {
  url: string;
  file: File | null;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

interface FileUploadResponse {
  image_url: string;
}

interface Product {
  id?: number;
  title: string;
  description: string;
  image_url?: string;
  github: string;
  blog: string;
}

const CreateProductPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [github, setGithub] = useState<string>('');
  const [blog, setBlog] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [featuredImage, setFeaturedImage] = useState<FeaturedImage | null>(null);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 画像削除処理の追加
  const deleteImage = async (imageUrl: string) => {
    try {
      const response = await fetch('http://localhost:8080/image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiErrorResponse;
        console.error('画像削除エラー:', errorData);
      }
    } catch (error) {
      console.error('画像削除中にエラーが発生しました:', error);
    }
  };
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:8080/auth/check', { credentials: 'include' });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('認証チェックエラー:', error);
        router.push('/login');
      }
    };

    checkAuth();

    // コンポーネントのクリーンアップ時に未保存の画像を削除
    return () => {
      if (featuredImage?.url) {
        deleteImage(featuredImage.url);
      }
    };
  }, [router, featuredImage]);

  if (!isAuthenticated) return null;

  const handleCreate = async () => {
    // 入力検証
    if (!title.trim()) {
      setErrorMessage('タイトルは必須です');
      return;
    }
    
    if (!description.trim()) {
      setErrorMessage('説明は必須です');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const productData: Product = {
        title,
        description,
        image_url: featuredImage?.url || undefined,
        github,
        blog
      };
      
      const response = await fetch('http://localhost:8080/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
        credentials: 'include'
      });
    
      // APIからのエラーレスポンスを処理
      if (!response.ok) {
        const errorData = await response.json() as ApiErrorResponse;
        setErrorMessage(errorData.message || errorData.error || 'エラーが発生しました');
        setIsSubmitting(false);
        return;
      }
    
      router.push('/admin/product');
    } catch (error) {
      console.error('投稿エラー:', error);
      setErrorMessage('サーバーとの通信中にエラーが発生しました');
      setIsSubmitting(false);
    }
  };

  // 画像選択ハンドラ
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageToEdit(reader.result);
        handleImageUpload(file);
      }
    };
    reader.readAsDataURL(file);
  };

  // 画像アップロードハンドラ
  const handleImageUpload = async (file: File) => {
    if (!file) {
      setErrorMessage('画像の処理に失敗しました');
      return;
    }

    try {
      // 既存の画像があれば削除
      if (featuredImage?.url) {
        await deleteImage(featuredImage.url);
      }

      const formData = new FormData();
      formData.append('file', file, file.name);
      
      const fileResponse = await fetch('http://localhost:8080/image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!fileResponse.ok) {
        const errorText = await fileResponse.text();
        setErrorMessage(`ファイルアップロードに失敗しました: ${errorText}`);
        return;
      }
      
      const fileData = await fileResponse.json() as FileUploadResponse;
      
      // 画像の状態を更新
      setFeaturedImage({
        url: fileData.image_url,
        file: file
      });
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      setErrorMessage('画像のアップロード中にエラーが発生しました');
    }
  };

  // 画像を削除するハンドラ
  const handleRemoveImage = async () => {
    if (featuredImage?.url) {
      await deleteImage(featuredImage.url);
      setFeaturedImage(null);
    }
  };

  // 戻るボタンのハンドラ（画像削除を追加）
  const handleGoBack = async () => {
    // 未保存の画像があれば削除
    if (featuredImage?.url) {
      await deleteImage(featuredImage.url);
    }
    router.push('/admin/product');
  };

  // エラーメッセージを閉じる
  const dismissError = () => {
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* エラーポップアップ */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 z-50 max-w-md flex items-start">
          <AlertCircle className="text-red-500 mr-2 mt-0.5 shrink-0" size={18} />
          <div className="flex-1">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 ml-2"
            onClick={dismissError}
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={handleGoBack} 
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            type="button"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">戻る</span>
          </button>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleCreate} 
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium" 
              disabled={isSubmitting}
              type="button"
            >
              <Save size={14} />
              {isSubmitting ? '保存中...' : '保存する'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto mt-6 mb-16">
        <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
        
        {/* アイキャッチ画像エリア */}
        <div className="relative">
        {featuredImage ? (
          <div className="relative w-full h-56 bg-gray-100">
            <img 
              src={featuredImage.url} 
              alt="プロダクト画像" 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={handleRemoveImage}
              className="absolute top-3 right-3 bg-black bg-opacity-60 text-white p-1 rounded-full hover:bg-opacity-80"
              type="button"
            >
              <X size={18} />
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 flex items-center gap-1"
              type="button"
            >
              <ImageIcon size={16} />
              <span className="text-xs">変更</span>
            </button>
          </div>
          ) : (
            <div 
              className="w-full h-32 flex flex-col items-center justify-center bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <ImageIcon size={24} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">プロダクト画像を設定</p>
            </div>
          )}
        </div>

        <div className="px-4 py-6">
          <input 
            type="text" 
            placeholder="タイトル" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full text-3xl font-bold mb-6 p-0 border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
          />
          
          {/* 説明文エリア */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">説明</label>
            <textarea 
              placeholder="プロダクトの説明を入力してください" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full min-h-32 p-3 border border-gray-300 rounded resize-y focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={8}
            />
          </div>

          {/* GitHub リンク */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Github size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">GitHub リンク</span>
            </div>
            <input 
              type="text" 
              placeholder="https://github.com/username/repo" 
              value={github} 
              onChange={(e) => setGithub(e.target.value)} 
              className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          {/* ブログ記事リンク */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">関連ブログ記事URL</span>
            </div>
            <input 
              type="text" 
              placeholder="https://blog.com/article" 
              value={blog} 
              onChange={(e) => setBlog(e.target.value)} 
              className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default CreateProductPage;