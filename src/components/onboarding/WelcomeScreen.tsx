'use client';

import { OnboardingData } from '@/app/onboarding/page';
import { AIMessage } from './AIMessage';

interface WelcomeScreenProps {
  onNext: (data: Partial<OnboardingData>) => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const handleGoogleLogin = () => {
    // Google認証の実装
    console.log('Google login');
    onNext({});
  };

  const handleAppleLogin = () => {
    // Apple認証の実装
    console.log('Apple login');
    onNext({});
  };

  const handleEmailSignup = () => {
    // メール登録の実装
    console.log('Email signup');
    onNext({});
  };

  return (
    <div className="space-y-6">
      {/* AI Welcome Message */}
      <AIMessage>
        はじめまして！私があなたの学習パートナー、StudyBoosterです。一緒に頑張りましょう！まずはアカウントを連携してくださいね。
      </AIMessage>

      {/* Login Options */}
      <div className="space-y-3">
        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-gray-700 font-medium">Googleで続ける</span>
        </button>

        {/* Apple Login */}
        <button
          onClick={handleAppleLogin}
          className="w-full flex items-center justify-center space-x-3 bg-black text-white rounded-xl px-4 py-3 hover:bg-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <span className="font-medium">Appleで続ける</span>
        </button>

        {/* Email Signup */}
        <button
          onClick={handleEmailSignup}
          className="w-full flex items-center justify-center space-x-3 bg-transparent border-2 border-gray-300 text-gray-700 rounded-xl px-4 py-3 hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">メールアドレスで登録</span>
        </button>
      </div>
    </div>
  );
}

