import React from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
  imageUrl: string;
  aspectRatio?: number;
  maxFileSize?: number;
  onCancel: () => void;
  onCrop: (croppedFile: File) => void;
}

const ImageCropper = ({ 
  imageUrl, 
  aspectRatio = 16 / 9,
  maxFileSize = 5 * 1024 * 1024,
  onCancel, 
  onCrop 
}: ImageCropperProps): React.ReactElement => {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const onCropComplete = React.useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    // base64形式の画像かどうかを判定
    const isBase64 = imageSrc.startsWith('data:image');
    
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      // base64の場合はcrossOriginを設定しない
      if (!isBase64) {
        img.crossOrigin = 'anonymous';
      }
      
      img.onload = () => resolve(img);
      img.onerror = (error) => {
        console.error('画像読み込みエラー:', error);
        console.error('エラーが発生した画像URL:', imageSrc);
        reject(new Error(`画像の読み込みに失敗しました: ${imageSrc}`));
      };
      img.src = imageSrc;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('エラーが発生した画像URL:', imageSrc);
      throw new Error('キャンバスコンテキストが利用できません');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('エラーが発生した画像URL:', imageSrc);
          reject(new Error('Blobの作成に失敗しました'));
        } else {
          resolve(blob);
        }
      }, 'image/jpeg', 0.85);
    });
  };

  const handleCropConfirm = async () => {
    if (!croppedAreaPixels) {
      setError('トリミング領域が選択されていません');
      return;
    }

    try {
      const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
      
      if (croppedBlob.size > maxFileSize) {
        setError(`ファイルサイズが大きすぎます。${maxFileSize / 1024 / 1024}MB以下にしてください。`);
        return;
      }

      const croppedFile = new File([croppedBlob], 'cropped-image.jpg', { 
        type: 'image/jpeg' 
      });

      // URLを作成せず、Fileオブジェクトを直接渡す
      onCrop(croppedFile);
    } catch (error) {
      console.error('画像トリミングエラー:', error);
      console.error('エラーが発生した画像URL:', imageUrl);
      setError('画像のトリミングに失敗しました');
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 1));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden">
        {error && (
          <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-300 text-red-700 p-2 rounded z-10">
            {error}
            <button 
              onClick={() => setError(null)}
              className="absolute top-1 right-1 text-red-700 hover:text-red-900"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="relative w-full h-[500px] bg-gray-100">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <button 
            onClick={handleZoomOut} 
            className="bg-white/80 p-2 rounded-full hover:bg-white/90"
            disabled={zoom <= 1}
          >
            <ZoomOut size={20} className="text-gray-700" />
          </button>
          <button 
            onClick={handleZoomIn} 
            className="bg-white/80 p-2 rounded-full hover:bg-white/90"
            disabled={zoom >= 3}
          >
            <ZoomIn size={20} className="text-gray-700" />
          </button>
        </div>

        <div className="flex justify-between p-4 bg-gray-50">
          <button 
            onClick={onCancel} 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md"
          >
            <X size={16} />キャンセル
          </button>
          <button 
            onClick={handleCropConfirm} 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Check size={16} />画像を選択
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;