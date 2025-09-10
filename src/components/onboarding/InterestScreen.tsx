'use client';

import { useState } from 'react';
import { OnboardingData } from '@/app/onboarding/page';

interface InterestScreenProps {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
}

const interestOptions = [
  '数学', '物理', '化学', '生物', '英語', '国語', '社会', '地理', '歴史',
  'プログラミング', 'デザイン', '音楽', '美術', '体育', 'その他'
];

export function InterestScreen({ onNext, onBack, data }: InterestScreenProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(data.interests || []);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    onNext({ interests: selectedInterests });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          興味のある分野を選択してください
        </h2>
        <p className="text-gray-600">
          複数選択可能です。学習の参考にさせていただきます。
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {interestOptions.map((interest) => (
          <button
            key={interest}
            onClick={() => handleInterestToggle(interest)}
            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
              selectedInterests.includes(interest)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            {interest}
          </button>
        ))}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          戻る
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          次へ
        </button>
      </div>
    </div>
  );
}