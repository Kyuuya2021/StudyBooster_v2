'use client';

import Link from 'next/link';
import { OnboardingData } from '../page';

export default function OnboardingCompletePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Success Animation */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">セットアップ完了！</h1>
          <p className="text-gray-600">StudyBoosterへようこそ</p>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">
          あなたの学習パートナーとして、目標達成まで一緒に頑張りましょう。さっそく学習を始めてみませんか？
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/home"
            className="block w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-4 px-8 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg text-lg"
          >
            ホームへ
          </Link>
          
          <Link
            href="/"
            className="block w-full text-gray-600 hover:text-gray-800 transition-colors py-2"
          >
            ホームに戻る
          </Link>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 pt-8">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600">学習計画</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600">進捗管理</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600">AI支援</p>
          </div>
        </div>
      </div>
    </div>
  );
}

