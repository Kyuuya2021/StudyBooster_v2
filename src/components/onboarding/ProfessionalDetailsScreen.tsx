'use client';

import { useState } from 'react';
import { OnboardingData } from '@/app/onboarding/page';
import { AIMessage } from './AIMessage';

interface ProfessionalDetailsScreenProps {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
}

const learningPurposes = [
  '資格取得のため',
  '現在の仕事のスキルアップ',
  '転職・キャリアアップのため',
  '趣味・教養を深めるため',
  '新しい分野への挑戦',
  '昇進・昇格のため'
];

const industries = [
  'IT・エンジニア',
  '企画・マーケティング',
  '営業',
  '金融・コンサルティング',
  '医療・福祉',
  '教育',
  '製造業',
  '小売・サービス',
  '公務員',
  'その他'
];

const skills = [
  'データ分析',
  'AI・機械学習',
  'プロジェクトマネジメント',
  'デザイン',
  '語学',
  '会計・ファイナンス',
  'プログラミング',
  'マーケティング',
  '営業・交渉',
  'リーダーシップ',
  'その他'
];

export function ProfessionalDetailsScreen({ onNext, onBack, data }: ProfessionalDetailsScreenProps) {
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handlePurposeToggle = (purpose: string) => {
    setSelectedPurposes(prev => 
      prev.includes(purpose) 
        ? prev.filter(p => p !== purpose)
        : [...prev, purpose]
    );
  };

  const handleIndustrySelect = (industry: string) => {
    setSelectedIndustry(industry);
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedPurposes.length > 0) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedIndustry) {
      setCurrentStep(3);
    } else if (currentStep === 3 && selectedSkills.length > 0) {
      onNext({
        professional: {
          purposes: selectedPurposes,
          industry: selectedIndustry,
          skills: selectedSkills
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onBack();
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1: return selectedPurposes.length > 0;
      case 2: return selectedIndustry !== '';
      case 3: return selectedSkills.length > 0;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <AIMessage>
              社会人の方ですね！まずは学習の目的を教えてください。複数選択できます。
            </AIMessage>
            <div className="grid grid-cols-1 gap-3">
              {learningPurposes.map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => handlePurposeToggle(purpose)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedPurposes.includes(purpose)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPurposes.includes(purpose)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedPurposes.includes(purpose) && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium">{purpose}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <AIMessage>
              ありがとうございます！あなたの職種・業界を教えてください。
            </AIMessage>
            <div className="grid grid-cols-2 gap-3">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => handleIndustrySelect(industry)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    selectedIndustry === industry
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">{industry}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <AIMessage>
              最後に、特に興味のある分野・スキルを教えてください。複数選択できます。
            </AIMessage>
            <div className="grid grid-cols-2 gap-3">
              {skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    selectedSkills.includes(skill)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`w-3 h-3 rounded-full ${
              step <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {renderStep()}

      {/* Continue Button */}
      {canContinue() && (
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
        >
          {currentStep === 3 ? '続ける' : '次へ'}
        </button>
      )}

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="w-full text-gray-500 hover:text-gray-700 transition-colors py-2"
      >
        ← 戻る
      </button>
    </div>
  );
}
