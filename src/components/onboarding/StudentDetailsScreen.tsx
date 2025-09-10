'use client';

import { useState } from 'react';
import { OnboardingData } from '@/app/onboarding/page';
import { AIMessage } from './AIMessage';

interface StudentDetailsScreenProps {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
}

const studentCategories = [
  {
    id: 'middle-school',
    title: '中学生',
    icon: '📚',
    grades: ['中学1年', '中学2年', '中学3年']
  },
  {
    id: 'high-school',
    title: '高校生・高専生',
    icon: '🎓',
    grades: ['高校1年', '高校2年', '高校3年', '高専1年', '高専2年', '高専3年', '高専4年', '高専5年']
  },
  {
    id: 'university',
    title: '大学生・専門学生',
    icon: '🎓',
    grades: ['大学1年', '大学2年', '大学3年', '大学4年', '専門学校1年', '専門学校2年', '専門学校3年', '専門学校4年']
  },
  {
    id: 'graduate',
    title: '大学院生',
    icon: '🔬',
    grades: ['大学院1年', '大学院2年', '博士課程']
  },
  {
    id: 'other',
    title: '教育関係者・その他',
    icon: '👨‍🏫',
    grades: ['教師', '講師', 'その他']
  }
];

const subjects = [
  '数学', '物理', '化学', '生物', '地学',
  '日本史', '世界史', '地理', '公民',
  '国語', '英語', 'プログラミング',
  '経済学', '心理学', '哲学', 'その他'
];

export function StudentDetailsScreen({ onNext, onBack }: StudentDetailsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep(2);
  };

  const handleGradeSelect = (grade: string) => {
    setSelectedGrade(grade);
    setCurrentStep(3);
  };

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleContinue = () => {
    if (selectedGrade && selectedSubjects.length > 0) {
      onNext({ 
        grade: selectedGrade, 
        subjects: selectedSubjects 
      });
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onBack();
    } else if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const canContinue = selectedGrade && selectedSubjects.length > 0;
  const selectedCategoryData = studentCategories.find(cat => cat.id === selectedCategory);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <AIMessage>
              学生さんなんですね！まずはあなたの身分を選択してください。
            </AIMessage>
            <div className="grid grid-cols-1 gap-4">
              {studentCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{category.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{category.title}</h3>
                      <p className="text-sm text-gray-600">タップして詳細を選択</p>
                    </div>
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
              {selectedCategoryData?.title}ですね！学年を選択してください。
            </AIMessage>
            <div className="grid grid-cols-2 gap-3">
              {selectedCategoryData?.grades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => handleGradeSelect(grade)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    selectedGrade === grade
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <AIMessage>
              ありがとうございます！次に、得意な科目や興味のある学問分野を教えてください。（複数選択OK）
            </AIMessage>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => handleSubjectToggle(subject)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    selectedSubjects.includes(subject)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {subject}
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
      {canContinue && (
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
        >
          続ける
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

