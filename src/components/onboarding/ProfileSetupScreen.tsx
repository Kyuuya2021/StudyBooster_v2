'use client';

import { useState } from 'react';
import { OnboardingData } from '@/app/onboarding/page';

interface ProfileSetupScreenProps {
  onComplete: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
}

const mbtiOptions = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export function ProfileSetupScreen({ onComplete, onBack, data }: ProfileSetupScreenProps) {
  const [name, setName] = useState(data.profile?.name || '');
  const [mbti, setMbti] = useState(data.profile?.mbti || '');

  const handleComplete = () => {
    onComplete({
      profile: {
        name,
        mbti,
        avatar: data.profile?.avatar
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          プロフィールを設定
        </h2>
        <p className="text-gray-600">
          最後のステップです。お好みで設定してください。
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            お名前（任意）
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="お名前を入力してください"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            MBTI（任意）
          </label>
          <div className="grid grid-cols-4 gap-2">
            {mbtiOptions.map((type) => (
              <button
                key={type}
                onClick={() => setMbti(type)}
                className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                  mbti === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          戻る
        </button>
        <button
          onClick={handleComplete}
          className="flex-1 py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          完了
        </button>
      </div>
    </div>
  );
}