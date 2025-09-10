'use client';

import { useState } from 'react';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { WelcomeScreen } from '@/components/onboarding/WelcomeScreen';
import { UserTypeScreen } from '@/components/onboarding/UserTypeScreen';
import { StudentDetailsScreen } from '@/components/onboarding/StudentDetailsScreen';
import { InterestScreen } from '@/components/onboarding/InterestScreen';
import { ProfileSetupScreen } from '@/components/onboarding/ProfileSetupScreen';
import { ProfessionalDetailsScreen } from '@/components/onboarding/ProfessionalDetailsScreen';
import { useUser } from '@/contexts/AppContext';

export type OnboardingData = {
  userType?: 'student' | 'professional';
  grade?: string;
  subjects?: string[];
  interests?: string[];
  professional?: {
    purposes?: string[];
    industry?: string;
    skills?: string[];
  };
  profile?: {
    name?: string;
    avatar?: string;
    mbti?: string;
  };
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const { setUser, setOnboardingComplete } = useUser();

  const handleNext = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    
    // ユーザータイプに応じてフローを分岐
    if (currentStep === 2 && data.userType) {
      // ユーザータイプ選択後、学生か社会人かで分岐
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // 学生詳細または社会人詳細の後
      if (onboardingData.userType === 'student') {
        setCurrentStep(4); // 興味分野へ
      } else {
        setCurrentStep(5); // プロフィール設定へ（社会人は興味分野をスキップ）
      }
    } else if (currentStep === 4) {
      // 興味分野の後
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // オンボーディング完了
      const finalData = { ...onboardingData, ...data };
      setUser(finalData);
      setOnboardingComplete(true);
      window.location.href = '/onboarding/complete';
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeScreen onNext={handleNext} />;
      case 2:
        return <UserTypeScreen onNext={handleNext} onBack={handleBack} />;
      case 3:
        // ユーザータイプに応じて分岐
        if (onboardingData.userType === 'student') {
          return <StudentDetailsScreen onNext={handleNext} onBack={handleBack} data={onboardingData} />;
        } else if (onboardingData.userType === 'professional') {
          return <ProfessionalDetailsScreen onNext={handleNext} onBack={handleBack} data={onboardingData} />;
        }
        return <UserTypeScreen onNext={handleNext} onBack={handleBack} />;
      case 4:
        // 学生のみ興味分野を表示
        if (onboardingData.userType === 'student') {
          return <InterestScreen onNext={handleNext} onBack={handleBack} data={onboardingData} />;
        }
        return <ProfileSetupScreen onComplete={handleNext} onBack={handleBack} data={onboardingData} />;
      case 5:
        return <ProfileSetupScreen onComplete={handleNext} onBack={handleBack} data={onboardingData} />;
      default:
        return <WelcomeScreen onNext={handleNext} />;
    }
  };

  return (
    <OnboardingLayout>
      {renderCurrentStep()}
    </OnboardingLayout>
  );
}
