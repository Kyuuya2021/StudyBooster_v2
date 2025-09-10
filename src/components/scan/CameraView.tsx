'use client';

import { RefObject, useState } from 'react';

interface CameraViewProps {
  videoRef: RefObject<HTMLVideoElement>;
  onCapture: () => void;
  onCancel: () => void;
}

export function CameraView({ videoRef, onCapture, onCancel }: CameraViewProps) {
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    onCapture();
    // Reset capturing state after a short delay
    setTimeout(() => setIsCapturing(false), 1000);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Full Screen Camera Preview */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ 
            transform: 'scaleX(-1)', // ミラー効果
            WebkitTransform: 'scaleX(-1)'
          }}
        />
        
        {/* Flash Effect */}
        {flashEnabled && isCapturing && (
          <div className="absolute inset-0 bg-white animate-pulse"></div>
        )}
        
        {/* Camera Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
            {/* Back Button */}
            <button
              onClick={onCancel}
              className="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all pointer-events-auto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Flash Toggle */}
            <button
              onClick={() => setFlashEnabled(!flashEnabled)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all pointer-events-auto ${
                flashEnabled 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </div>

          {/* Focus Frame */}
          <div className="absolute inset-8 border-2 border-white border-dashed rounded-lg opacity-60">
            {/* Corner Indicators */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>
          </div>
          
          {/* Center Crosshair */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 border-2 border-white rounded-full opacity-80">
              <div className="w-3 h-3 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>

          {/* Bottom Instructions */}
          <div className="absolute bottom-32 left-0 right-0 text-center">
            <p className="text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full inline-block">
              問題をフレーム内に収めて撮影
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
        <div className="flex justify-center items-center space-x-12">
          {/* Gallery Button */}
          <button
            onClick={() => alert('写真ライブラリ機能は近日実装予定です')}
            className="w-12 h-12 bg-white bg-opacity-20 text-white rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Capture Button */}
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl ${
              isCapturing
                ? 'bg-gray-400 scale-95'
                : 'bg-white hover:scale-105 active:scale-95'
            }`}
          >
            <div className={`w-16 h-16 rounded-full border-4 transition-all ${
              isCapturing
                ? 'border-gray-300 bg-gray-200'
                : 'border-gray-300 bg-white'
            }`}></div>
          </button>

          {/* Camera Switch Button */}
          <button
            onClick={() => alert('カメラ切り替え機能は近日実装予定です')}
            className="w-12 h-12 bg-white bg-opacity-20 text-white rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
