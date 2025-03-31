'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon,
  X,
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react';
import '@/app/ui/globals.css'
import ImageCropper from '@/app/component/ImageCropper';

// 型定義
interface FeaturedImage {
  url: string;
  file: File | null;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

interface FileUploadResponse {
  image_url: string;
}

interface ProductData {
  id: number;
  title: string;
  description: string;
  image_url?: string | null;
  github: string;
  blog: string;
  created_at: string;
  updated_at: string;
}

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [github, setGithub] = useState<string>('');
  const [blog, setBlog] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [featuredImage, setFeaturedImage] = useState<FeaturedImage | null>(null);
  const [originalFeaturedImage, setOriginalFeaturedImage] = useState<string | null>(null);
  const [croppingImage, setCroppingImage] = useState<boolean>(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);

  // 画像削除処理
  const deleteImage = async (imageUrl: string) => {
    try {
      // URLが空や未定義の場合は処理しない
      if (!imageUrl) return;

      const response = await fetch('http://localhost:8080/image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiErrorResponse;
        console.error('画像削除エラー:', errorData);
        setErrorMessage(`画像削除に失敗しました: ${errorData.message || '不明なエラー'}`);
      }
    } catch (error) {
      console.error('画像削除中にエラーが発生しました:', error);
      setErrorMessage('画像削除中にネットワークエラーが発生しました');
    }
  };

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

    // コンポーネントのクリーンアップ時に未保存の画像を削除
    return () => {
      if (featuredImage?.url && featuredImage.url !== originalFeaturedImage) {
        deleteImage(featuredImage.url);
      }
    };
  }, [router, originalFeaturedImage, featuredImage?.url]);

  // 認証チェックが終わるまで描画を防ぐ
  if (isAuthenticated === null) return null;

  // プロダクトデータの取得
  useEffect(() => {
    if (!productId || isAuthenticated === false) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/product/${productId}`, { credentials: 'include' });
        if (!response.ok) {
          throw new Error('プロダクトの取得に失敗しました');
        }

        const product: ProductData = await response.json();

        setTitle(product.title || '');
        setDescription(product.description || '');
        setGithub(product.github || '');
        setBlog(product.blog || '');

        if (product.image_url) {
          setFeaturedImage({
            url: product.image_url,
            file: null
          });
          setOriginalFeaturedImage(product.image_url);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('プロダクト取得エラー:', error);
        setErrorMessage('プロダクトの取得に失敗しました');
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isAuthenticated]);

  const handleUpdate = async () => {
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
      // 画像パスの処理
      const image_url = imageRemoved 
        ? '' 
        : (featuredImage?.url || originalFeaturedImage || '');
      
      const response = await fetch(`http://localhost:8080/product/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description,
          image_url,
          github,
          blog
        }),
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
      console.error('プロダクト更新エラー:', error);
      setErrorMessage('サーバーとの通信中にエラーが発生しました');
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageToEdit(reader.result);
        setCroppingImage(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile: File) => {
    if (!croppedFile) {
      setErrorMessage('画像の処理に失敗しました');
      setCroppingImage(false);
      return;
    }
  
    try {
      // 既存の画像があれば削除（元の画像と現在の画像が異なる場合）
      if (featuredImage?.url && featuredImage.url !== originalFeaturedImage) {
        await deleteImage(featuredImage.url);
      }
  
      const formData = new FormData();
      formData.append('file', croppedFile, croppedFile.name);
      
      const fileResponse = await fetch('http://localhost:8080/image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!fileResponse.ok) {
        const errorText = await fileResponse.text();
        setErrorMessage(`ファイルアップロードに失敗しました: ${errorText}`);
        setCroppingImage(false);
        return;
      }
      
      const fileData = await fileResponse.json() as FileUploadResponse;
      
      // 画像の状態を更新
      setFeaturedImage({
        url: fileData.image_url,
        file: croppedFile
      });
      
      // 画像削除フラグをリセット
      setImageRemoved(false);
      
      setCroppingImage(false);
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      setErrorMessage('画像のアップロード中にエラーが発生しました');
      setCroppingImage(false);
    }
  };

  // 画像を削除するハンドラ
  const handleRemoveImage = async () => {
    try {
      // 現在の画像URLを特定
      const imageToDelete = featuredImage?.url || originalFeaturedImage;
      
      if (imageToDelete) {
        // 画像を削除
        await deleteImage(imageToDelete);
        
        // 状態をリセット
        setFeaturedImage(null);
        setOriginalFeaturedImage(null);
        setImageRemoved(true);
      }
    } catch (error) {
      console.error('画像削除エラー:', error);
      setErrorMessage('画像の削除中にエラーが発生しました');
    }
  };

  // 戻るボタンのハンドラ
  const handleGoBack = async () => {
    try {
      // 新規アップロードされた画像で、元の画像と異なる場合のみ削除
      if (
        featuredImage?.url && 
        featuredImage.url !== originalFeaturedImage
      ) {
        await deleteImage(featuredImage.url);
      }
      
      router.push('/admin/product');
    } catch (error) {
      console.error('戻る処理中のエラー:', error);
      setErrorMessage('ページ遷移中にエラーが発生しました');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-3 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

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
            onClick={() => setErrorMessage(null)}
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
              onClick={handleUpdate} 
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full text-sm font-medium" 
              disabled={isSubmitting}
              type="button"
            >
              <Save size={14} />
              {isSubmitting ? '更新中...' : '更新'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto mt-6 mb-16">
        <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
        
        {croppingImage && imageToEdit && (
          <ImageCropper 
            imageUrl={imageToEdit} 
            onCancel={() => setCroppingImage(false)} 
            onCrop={handleCropComplete} 
            aspectRatio={16/9} 
          />
        )}

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
              className="w-full h-48 flex flex-col items-center justify-center bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
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

        <div className="px-4 py-6 space-y-6">
          {/* タイトル入力 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              タイトル*
            </label>
            <input 
              id="title"
              type="text" 
              placeholder="プロダクト名" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full text-lg p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* 説明入力 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              説明*
            </label>
            <textarea 
              id="description"
              placeholder="プロダクトの説明" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={6}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* GitHub URL入力 */}
          <div>
            <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <LinkIcon size={14} className="mr-1" />
              GitHub URL
            </label>
            <input 
              id="github"
              type="text" 
              placeholder="https://github.com/username/repository" 
              value={github} 
              onChange={(e) => setGithub(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* ブログURL入力 */}
          <div>
            <label htmlFor="blog" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <LinkIcon size={14} className="mr-1" />
              ブログURL
            </label>
            <input 
              id="blog"
              type="text" 
              placeholder="https://example.com/blog-post" 
              value={blog} 
              onChange={(e) => setBlog(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProductPage;