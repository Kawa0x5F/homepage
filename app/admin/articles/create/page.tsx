'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  Save, 
  Image as ImageIcon,
  X,
  AlertCircle
} from 'lucide-react';
import RichTextEditor from '@/app/component/RichTextEditor';
import ImageCropper from '@/app/component/ImageCropper';

// 型定義を追加
interface FeaturedImage {
  url: string;
  file: File | null;
}

// APIのエラーレスポンス型を定義
interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

const CreateArticlePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSubmittingPublish, setIsSubmittingPublish] = useState<boolean>(false);
  const [isSubmittingDraft, setIsSubmittingDraft] = useState<boolean>(false);
  const [featuredImage, setFeaturedImage] = useState<FeaturedImage | null>(null);
  const [croppingImage, setCroppingImage] = useState<boolean>(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleCreate = async (publish = false) => {
    // 入力検証
    if (!title.trim()) {
      setErrorMessage('タイトルは必須です');
      return;
    }
    
    if (!content.trim()) {
      setErrorMessage('本文は必須です');
      return;
    }
    
    if (!slug.trim()) {
      setErrorMessage('URLの設定は必須です');
      return;
    }
    
    // 公開と下書きの状態を個別に管理
    if (publish) {
      setIsSubmittingPublish(true);
    } else {
      setIsSubmittingDraft(true);
    }
    
    setErrorMessage(null);
    
    try {
      // アイキャッチ画像がある場合は先にアップロード処理を行う想定
      const image_path = featuredImage?.url || null;
      
      const response = await fetch('http://localhost:8080/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          slug, 
          content,
          is_publish: publish,
          image_path
        }),
      });
      
      // APIからのエラーレスポンスを処理
      if (!response.ok) {
        const errorData = await response.json() as ApiErrorResponse;
        setErrorMessage(errorData.message || errorData.error || 'エラーが発生しました');
        setIsSubmittingPublish(false);
        setIsSubmittingDraft(false);
        return;
      }
      
      router.push('/admin/articles');
    } catch (error) {
      console.error('投稿エラー:', error);
      setErrorMessage('サーバーとの通信中にエラーが発生しました');
      setIsSubmittingPublish(false);
      setIsSubmittingDraft(false);
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

  const handleCropComplete = (croppedImageUrl: string, croppedFile?: File) => {
    setFeaturedImage({
      url: croppedImageUrl,
      file: croppedFile || null
    });
    setCroppingImage(false);
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
            onClick={() => router.back()} 
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            type="button"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">戻る</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center">
              <span className="text-xs text-gray-500 mr-1">URL:</span>
              <input 
                type="text" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)}
                className="text-sm py-1 px-2 border border-gray-300 rounded w-40"
                placeholder="カスタムURL"
              />
            </div>
            <button 
              onClick={() => handleCreate(false)} 
              className="text-sm text-gray-600 flex items-center gap-1 px-3 py-1 rounded-full hover:bg-gray-100" 
              disabled={isSubmittingDraft || isSubmittingPublish}
              type="button"
            >
              <Clock size={14} />
              {isSubmittingDraft ? '保存中...' : '下書き保存'}
            </button>
            <button 
              onClick={() => handleCreate(true)} 
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full text-sm font-medium" 
              disabled={isSubmittingPublish || isSubmittingDraft}
              type="button"
            >
              <Save size={14} />
              {isSubmittingPublish ? '公開中...' : '公開する'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto mt-6 mb-16">
        <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
        
        {croppingImage && imageToEdit && (
          <ImageCropper imageUrl={imageToEdit} onCancel={() => setCroppingImage(false)} onCrop={handleCropComplete} aspectRatio={16/9} />
        )}

        {/* アイキャッチ画像エリア */}
        <div className="relative">
          {featuredImage ? (
            <div className="relative w-full h-56 bg-gray-100">
              <img 
                src={featuredImage.url} 
                alt="アイキャッチ画像" 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setFeaturedImage(null)}
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
              <p className="text-sm text-gray-500">アイキャッチ画像を設定</p>
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
          
          {/* エディタ部分 */}
          <div className="prose prose-lg max-w-none">
            <RichTextEditor 
              content={content} 
              setContent={setContent} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateArticlePage;