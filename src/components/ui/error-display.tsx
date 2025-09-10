'use client';

import { AppError, getErrorDisplayData } from '@/lib/error-handler';
import { Button } from './button';

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
  className?: string;
}

export function ErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  showDetails = false,
  className = ''
}: ErrorDisplayProps) {
  const displayData = getErrorDisplayData(error);

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      {/* エラーアイコンとタイトル */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-red-800">
            {displayData.title}
          </h3>
          <p className="mt-1 text-sm text-red-700">
            {displayData.message}
          </p>
          
          {/* エラー詳細 */}
          {showDetails && (
            <div className="mt-2 text-xs text-red-600">
              <p>エラーコード: {displayData.code}</p>
              <p>発生時刻: {new Date(displayData.timestamp).toLocaleString('ja-JP')}</p>
            </div>
          )}
        </div>
      </div>

      {/* アクションボタン */}
      <div className="mt-4 flex space-x-3">
        {displayData.canRetry && onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="text-red-700 border-red-300 hover:bg-red-100"
          >
            再試行
          </Button>
        )}
        
        {onDismiss && (
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-100"
          >
            閉じる
          </Button>
        )}
      </div>
    </div>
  );
}

// インラインエラー表示（小さなエラー用）
interface InlineErrorProps {
  error: AppError;
  onRetry?: () => void;
  className?: string;
}

export function InlineError({ error, onRetry, className = '' }: InlineErrorProps) {
  const displayData = getErrorDisplayData(error);

  return (
    <div className={`flex items-center space-x-2 text-sm text-red-600 ${className}`}>
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="flex-1">{displayData.message}</span>
      {displayData.canRetry && onRetry && (
        <button
          onClick={onRetry}
          className="text-red-700 hover:text-red-800 underline text-xs"
        >
          再試行
        </button>
      )}
    </div>
  );
}

// エラーページ用の大きな表示
interface ErrorPageProps {
  error: AppError;
  onRetry?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export function ErrorPage({ error, onRetry, onGoHome, className = '' }: ErrorPageProps) {
  const displayData = getErrorDisplayData(error);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex flex-col items-center justify-center p-6 ${className}`}>
      <div className="text-center max-w-md">
        {/* エラーアイコン */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center shadow-2xl">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        {/* エラーメッセージ */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            {displayData.title}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {displayData.message}
          </p>
        </div>

        {/* アクションボタン */}
        <div className="space-y-4 w-full">
          {displayData.canRetry && onRetry && (
            <Button
              onClick={onRetry}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all shadow-lg text-lg"
            >
              🔄 もう一度試す
            </Button>
          )}
          
          {onGoHome && (
            <Button
              onClick={onGoHome}
              variant="outline"
              className="w-full text-gray-600 hover:text-gray-800 transition-colors py-3 font-medium"
            >
              🏠 ホームに戻る
            </Button>
          )}
        </div>

        {/* ヘルプセクション */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">💡 トラブルシューティング</h3>
          <ul className="text-sm text-yellow-700 space-y-1 text-left">
            <li>• カメラの権限が許可されているか確認してください</li>
            <li>• インターネット接続を確認してください</li>
            <li>• 問題がはっきり見えるように撮影してください</li>
            <li>• 手ブレに注意して撮影してください</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
