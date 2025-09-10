'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AnalyzingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { text: '画像を読み込み中...', duration: 1000 },
    { text: '文字を認識中...', duration: 2000 },
    { text: '問題を解析中...', duration: 3000 },
    { text: '解答を生成中...', duration: 2000 },
    { text: '解説を準備中...', duration: 1000 }
  ];

  useEffect(() => {
    const imageData = searchParams.get('image');
    if (!imageData) {
      router.push('/scan');
      return;
    }

    // 解析プロセスを開始
    startAnalysis(imageData);
  }, [searchParams, router, startAnalysis]);

  const startAnalysis = useCallback(async (imageData: string) => {
    let currentProgress = 0;
    let stepIndex = 0;

    // プログレスバーのアニメーション
    const progressInterval = setInterval(() => {
      currentProgress += 2;
      setProgress(Math.min(currentProgress, 100));
    }, 100);

    // ステップの進行
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        setCurrentStep(stepIndex);
      }
    }, 1000);

    try {
      // 実際のAPI呼び出し
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: 解析に失敗しました`);
      }

      const result = await response.json();
      
      // 解析完了
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      setProgress(100);
      setCurrentStep(steps.length - 1);

      // 結果ページに遷移
      setTimeout(() => {
        router.push(`/result?data=${encodeURIComponent(JSON.stringify(result))}`);
      }, 1000);

    } catch (error) {
      console.error('Analysis error:', error);
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      
      // エラーメッセージを取得
      const errorMessage = error instanceof Error 
        ? error.message 
        : '解析中にエラーが発生しました';
      
      // エラーページに遷移
      setTimeout(() => {
        router.push(`/error?message=${encodeURIComponent(errorMessage)}`);
      }, 1000);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* AI Brain Animation */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl relative">
            <span className="text-6xl">🧠</span>
            
            {/* Rotating Ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-300 rounded-full animate-spin"></div>
            
            {/* Pulsing Dots */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{progress}% 完了</p>
        </div>

        {/* Current Step */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            AIが問題を解析中...
          </h2>
          <p className="text-gray-600 text-lg">
            {steps[currentStep]?.text || '解析を完了しています...'}
          </p>
        </div>

        {/* Processing Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                index <= currentStep 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-gray-50 text-gray-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                index < currentStep 
                  ? 'bg-green-500 text-white' 
                  : index === currentStep 
                    ? 'bg-blue-500 text-white animate-pulse' 
                    : 'bg-gray-300 text-gray-600'
              }`}>
                {index < currentStep ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <span className="text-sm font-medium">{step.text}</span>
            </div>
          ))}
        </div>

        {/* Fun Facts */}
        <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
          <h3 className="font-medium text-gray-800 mb-2">💡 豆知識</h3>
          <p className="text-sm text-gray-600">
            AIは1秒間に数百万回の計算を行い、画像から文字や数式を認識しています。
          </p>
        </div>
      </div>
    </div>
  );
}
