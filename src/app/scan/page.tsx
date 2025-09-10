'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HomeLayout } from '@/components/home/HomeLayout';
import { CameraView } from '@/components/scan/CameraView';
import { PhotoPreview } from '@/components/scan/PhotoPreview';
import { useCamera, useAppState } from '@/contexts/AppContext';
import { useImageManager } from '@/lib/image-manager';
import { useErrorHandler } from '@/lib/error-handler';
import { ErrorDisplay } from '@/components/ui/error-display';

export default function ScanPage() {
  const router = useRouter();
  const { cameraPermission, capturedImage, setCameraPermission, setCapturedImage } = useCamera();
  const { isLoading, error, setLoading, setError } = useAppState();
  const { validateImage, optimizeImage } = useImageManager();
  const { handleErrorWithLogging } = useErrorHandler();
  const [isDragOver, setIsDragOver] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleScanClick = async () => {
    setCameraPermission('requesting');
    setError(null);
    
    try {
      // カメラの可用性をチェック
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('このブラウザはカメラ機能をサポートしていません');
      }

      // カメラ設定
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch {
        // フォールバック: より基本的な設定を試す
        const fallbackConstraints = { video: true };
        stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
      }
      
      setCameraPermission('granted');
      
      // ビデオ要素にストリームを設定
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch((playError) => {
              console.error('Video play error:', playError);
            });
          }
        };
      }
      
    } catch (err) {
      const appError = handleErrorWithLogging(err, 'Camera access');
      setError(appError.userMessage);
      setCameraPermission('denied');
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        try {
          // キャンバスのサイズをビデオに合わせる
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // ビデオフレームをキャンバスに描画
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // 画像データを取得（高品質で）
          const imageData = canvas.toDataURL('image/jpeg', 0.9);
          setCapturedImage(imageData);
          
          // カメラストリームを停止
          if (video.srcObject) {
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
          }
        } catch (error) {
          console.error('Photo capture error:', error);
          alert('写真の撮影中にエラーが発生しました。もう一度お試しください。');
        }
      } else {
        alert('カメラが準備できていません。しばらく待ってからもう一度お試しください。');
      }
    }
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
    setCameraPermission('idle');
  };

  const handleProcessImage = async () => {
    if (!capturedImage) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 解析ページに遷移（画像データをクエリパラメータで渡す）
      router.push(`/analyzing?image=${encodeURIComponent(capturedImage)}`);
      
    } catch (error) {
      const appError = handleErrorWithLogging(error, 'Image processing');
      setError(appError.userMessage);
      setLoading(false);
    }
  };

  const handleLibrarySelect = () => {
    // ファイル入力要素を作成
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // カメラで撮影も可能
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    
    input.click();
  };

  const handleFileUpload = async (file: File) => {
    try {
      // 画像の検証
      const validation = validateImage(file);
      if (!validation.valid) {
        setError(validation.error!);
        return;
      }

      setLoading(true);
      setError(null);

      // 画像の最適化
      const { data } = await optimizeImage(file);
      setCapturedImage(data.data);
      setCameraPermission('granted'); // プレビュー表示のため
      setLoading(false);

    } catch (error) {
      const appError = handleErrorWithLogging(error, 'File upload');
      setError(appError.userMessage);
      setLoading(false);
    }
  };

  // ドラッグ&ドロップ機能
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        {cameraPermission === 'idle' && (
          <div className="text-center max-w-md w-full">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl mb-6">
                <span className="text-4xl">📁</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                問題をスキャン
              </h2>
              <p className="text-gray-600 leading-relaxed">
                問題の画像をアップロードして、<br />
                AIに解析してもらいましょう。
              </p>
            </div>

            {/* ドラッグ&ドロップエリア */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full p-8 border-2 border-dashed rounded-2xl transition-all mb-6 ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-2">
                  {isDragOver ? 'ここに画像をドロップ' : '画像をドラッグ&ドロップ'}
                </p>
                <p className="text-sm text-gray-500">または</p>
              </div>
            </div>

            <div className="space-y-4 w-full">
              <button
                onClick={handleLibrarySelect}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg text-lg"
              >
                📁 写真を選択
              </button>
              
              <button 
                onClick={handleScanClick}
                className="w-full text-gray-600 hover:text-gray-700 transition-colors py-3 font-medium border border-gray-300 rounded-xl hover:border-gray-400"
              >
                📷 カメラで撮影（開発中）
              </button>
            </div>
          </div>
        )}

        {cameraPermission === 'requesting' && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">カメラへのアクセスを確認中...</p>
          </div>
        )}

        {cameraPermission === 'denied' && (
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              カメラアクセスが拒否されました
            </h3>
            <p className="text-gray-600 mb-6">
              カメラを使用するには、ブラウザの設定でカメラアクセスを許可してください。
            </p>
            <button
              onClick={() => setCameraPermission('idle')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              もう一度試す
            </button>
          </div>
        )}

        {cameraPermission === 'granted' && !capturedImage && (
          <CameraView
            videoRef={videoRef as React.RefObject<HTMLVideoElement>}
            onCapture={handleCapturePhoto}
            onCancel={() => setCameraPermission('idle')}
          />
        )}

        {capturedImage && (
          <PhotoPreview
            imageData={capturedImage}
            onRetake={handleRetakePhoto}
            onProcess={handleProcessImage}
            isProcessing={isLoading}
          />
        )}

        {/* エラー表示 */}
        {error && (
          <div className="mt-6">
            <ErrorDisplay
              error={{ code: 'SCAN_ERROR', message: error, userMessage: error, timestamp: new Date().toISOString() }}
              onRetry={() => setError(null)}
              onDismiss={() => setError(null)}
            />
          </div>
        )}

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </HomeLayout>
  );
}
