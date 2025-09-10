'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HomeLayout } from '@/components/home/HomeLayout';

interface AnalysisResult {
  success: boolean;
  analysis: {
    subject: string;
    topic: string;
    difficulty: string;
    question: string;
    answer: string;
    explanation: string;
    steps: Array<{
      step: number;
      description: string;
      equation: string;
    }>;
    relatedConcepts: string[];
    confidence: number;
    application: {
      title: string;
      description: string;
    };
    quiz: Array<{
      question: string;
      options: string[];
      correct: string;
      explanation: string;
    }>;
  };
  metadata: {
    processingTime: number;
    timestamp: string;
    imageSize: number;
    aiModel: string;
  };
}

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsedResult = JSON.parse(decodeURIComponent(dataParam));
        setResult(parsedResult);
      } catch (error) {
        console.error('Failed to parse result data:', error);
        router.push('/error?message=結果データの読み込みに失敗しました');
      }
    } else {
      router.push('/scan');
    }
    setLoading(false);
  }, [searchParams, router]);

  if (loading) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">結果を読み込み中...</p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  if (!result || !result.success) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">解析に失敗しました</h2>
            <p className="text-gray-600 mb-6">もう一度お試しください。</p>
            <button
              onClick={() => router.push('/scan')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              もう一度スキャン
            </button>
          </div>
        </div>
      </HomeLayout>
    );
  }

  const { analysis } = result;

  return (
    <HomeLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">解析完了！</h1>
          <p className="text-gray-600">AIが問題を解析し、解答を生成しました</p>
        </div>

        {/* Problem Info */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">問題情報</h2>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {analysis.subject}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {analysis.difficulty}
              </span>
            </div>
          </div>
          <p className="text-lg text-gray-700 mb-2">トピック: {analysis.topic}</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 font-medium">{analysis.question}</p>
          </div>
        </div>

        {/* Answer */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">解答</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-lg font-semibold text-green-800">{analysis.answer}</p>
          </div>
        </div>

        {/* Solution Steps */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">解き方</h3>
          <div className="space-y-4">
            {analysis.steps.map((step, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 mb-2">{step.description}</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <code className="text-gray-800 font-mono">{step.equation}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">解説</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {analysis.explanation}
            </p>
          </div>
        </div>

        {/* Related Concepts */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">関連概念</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.relatedConcepts.map((concept, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Real-world Application */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">実生活での応用</h3>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">{analysis.application.title}</h4>
            <p className="text-purple-700 leading-relaxed">{analysis.application.description}</p>
          </div>
        </div>

        {/* Quiz Section */}
        {analysis.quiz && analysis.quiz.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">理解度チェック</h3>
            <div className="space-y-4">
              {analysis.quiz.map((quizItem, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">{quizItem.question}</h4>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {quizItem.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          optionIndex === 0
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </button>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">正解: {quizItem.correct}</span>
                    <p className="mt-1">{quizItem.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Score */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">解析精度</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${analysis.confidence * 100}%` }}
              ></div>
            </div>
            <span className="text-lg font-semibold text-gray-700">
              {Math.round(analysis.confidence * 100)}%
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            AIモデル: {result.metadata.aiModel}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/scan')}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            📷 新しい問題をスキャン
          </button>
          <button
            onClick={() => router.push('/home')}
            className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            🏠 ホームに戻る
          </button>
        </div>
      </div>
    </HomeLayout>
  );
}
