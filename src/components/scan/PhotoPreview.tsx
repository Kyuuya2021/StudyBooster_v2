'use client';

interface PhotoPreviewProps {
  imageData: string;
  onRetake: () => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export function PhotoPreview({ imageData, onRetake, onProcess, isProcessing }: PhotoPreviewProps) {
  return (
    <div className="w-full max-w-md">
      {/* Photo Preview */}
      <div className="relative bg-black rounded-2xl overflow-hidden mb-6 shadow-2xl">
        <img
          src={imageData}
          alt="Captured problem"
          className="w-full h-64 object-cover"
        />
        
        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-medium">画像を処理中...</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {!isProcessing ? (
          <>
            <button
              onClick={onProcess}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg text-lg"
            >
              🤖 AIで問題を解析
            </button>
            
            <button
              onClick={onRetake}
              className="w-full border-2 border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              📷 撮り直す
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600">AIが問題を解析しています...</p>
          </div>
        )}
      </div>

      {/* Image Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">📸 撮影完了</h4>
        <p className="text-sm text-gray-600">
          画像が正常に撮影されました。AIが問題を解析し、解答と解説を提供します。
        </p>
      </div>
    </div>
  );
}
