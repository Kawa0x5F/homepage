'use client';
import { FC, useState, useRef } from 'react';
import { X, Check, ZoomIn, ZoomOut, RotateCw, RefreshCw } from 'lucide-react';
import Cropper from 'react-cropper';

interface ImageCropperProps {
  imageUrl: string;
  onCancel: () => void;
  onCrop: (croppedImageUrl: string, croppedFile?: File) => void;
  aspectRatio?: number;
}

const ImageCropper: FC<ImageCropperProps> = ({ 
  imageUrl, 
  onCancel, 
  onCrop,
  aspectRatio = 16/9 
}) => {
  const cropperRef = useRef<any>(null);
  const [zoom, setZoom] = useState(0);

  const handleZoomIn = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      cropperRef.current.cropper.zoom(0.1);
      setZoom(prev => prev + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      cropperRef.current.cropper.zoom(-0.1);
      setZoom(prev => prev - 0.1);
    }
  };

  const handleRotateRight = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      cropperRef.current.cropper.rotate(90);
    }
  };

  const handleRotateLeft = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      cropperRef.current.cropper.rotate(-90);
    }
  };

  const handleReset = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      cropperRef.current.cropper.reset();
      setZoom(0);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      // base64 形式で切り抜かれた画像を取得
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        // croppedImageUrl を base64 で取得
        const croppedImageUrl = croppedCanvas.toDataURL('image/jpeg');

        // Canvas から File オブジェクトを作成
        croppedCanvas.toBlob((blob: Blob | null) => {
          if (blob) {
            const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
            
            // デバッグ用ログ
            console.log('Cropped Image URL:', croppedImageUrl);
            console.log('Cropped File:', croppedFile);

            // File と URL の両方を渡す
            onCrop(croppedImageUrl, croppedFile);
          } else {
            console.error('Blob creation failed');
          }
        }, 'image/jpeg');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-full overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">アイキャッチ画像のトリミング</h3>
          <button 
            onClick={onCancel} 
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 flex-grow overflow-hidden bg-gray-50">
          <Cropper
            ref={cropperRef}
            src={imageUrl}
            style={{ height: 400, width: '100%' }}
            aspectRatio={aspectRatio}
            guides={true}
            background={false}
            responsive={true}
            checkOrientation={false}
            zoomable={true}
            rotatable={true}
            movable={true}
            viewMode={1}
            minCropBoxHeight={50}
            minCropBoxWidth={50}
          />
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={handleZoomOut}
              className="p-2 rounded hover:bg-gray-200 text-gray-700"
              title="縮小"
              disabled={zoom <= -0.9}
            >
              <ZoomOut size={20} />
            </button>
            <button 
              onClick={handleZoomIn}
              className="p-2 rounded hover:bg-gray-200 text-gray-700"
              title="拡大"
            >
              <ZoomIn size={20} />
            </button>
            <button 
              onClick={handleRotateLeft}
              className="p-2 rounded hover:bg-gray-200 text-gray-700"
              title="左に回転"
            >
              <RotateCw size={20} className="transform -scale-x-100" />
            </button>
            <button 
              onClick={handleRotateRight}
              className="p-2 rounded hover:bg-gray-200 text-gray-700"
              title="右に回転"
            >
              <RotateCw size={20} />
            </button>
            <button 
              onClick={handleReset}
              className="p-2 rounded hover:bg-gray-200 text-gray-700"
              title="リセット"
            >
              <RefreshCw size={20} />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              キャンセル
            </button>
            <button 
              onClick={handleCrop}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <Check size={16} className="mr-1" />
              適用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;