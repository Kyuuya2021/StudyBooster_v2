'use client';

import { useState } from 'react';
import { OnboardingData } from '@/app/onboarding/page';
import { AIMessage } from './AIMessage';

interface UserTypeScreenProps {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

export function UserTypeScreen({ onNext, onBack }: UserTypeScreenProps) {
  const [selectedType, setSelectedType] = useState<'student' | 'professional' | null>(null);

  const handleTypeSelect = (type: 'student' | 'professional') => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      onNext({ userType: selectedType });
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Message */}
      <AIMessage>
        アカウント連携ありがとう！あなたのことを少し教えてください。
      </AIMessage>

      {/* User Type Selection */}
      <div className="flex space-x-3">
        {/* Student Option */}
        <button
          onClick={() => handleTypeSelect('student')}
          className={`flex-1 flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
            selectedType === 'student'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="w-12 h-12 mb-3 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <span className="font-medium text-lg">学生です</span>
        </button>

        {/* Professional Option */}
        <button
          onClick={() => handleTypeSelect('professional')}
          className={`flex-1 flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
            selectedType === 'professional'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="w-12 h-12 mb-3 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
          </div>
          <span className="font-medium text-lg">社会人です</span>
        </button>
      </div>

      {/* Continue Button */}
      {selectedType && (
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
        >
          続ける
        </button>
      )}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full text-gray-500 hover:text-gray-700 transition-colors py-2"
      >
        ← 戻る
      </button>
    </div>
  );
}

