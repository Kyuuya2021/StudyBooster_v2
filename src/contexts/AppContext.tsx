'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// 型定義
export interface User {
  id?: string;
  name?: string;
  avatar?: string;
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
}

export interface AnalysisResult {
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

export interface AppState {
  user: User | null;
  isOnboardingComplete: boolean;
  currentAnalysis: AnalysisResult | null;
  analysisHistory: AnalysisResult[];
  isLoading: boolean;
  error: string | null;
  cameraPermission: 'idle' | 'requesting' | 'granted' | 'denied';
  capturedImage: string | null;
}

// アクション型定義
export type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ONBOARDING_COMPLETE'; payload: boolean }
  | { type: 'SET_ANALYSIS_RESULT'; payload: AnalysisResult }
  | { type: 'ADD_TO_HISTORY'; payload: AnalysisResult }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CAMERA_PERMISSION'; payload: 'idle' | 'requesting' | 'granted' | 'denied' }
  | { type: 'SET_CAPTURED_IMAGE'; payload: string | null }
  | { type: 'CLEAR_ANALYSIS' }
  | { type: 'RESET_APP' };

// 初期状態
const initialState: AppState = {
  user: null,
  isOnboardingComplete: false,
  currentAnalysis: null,
  analysisHistory: [],
  isLoading: false,
  error: null,
  cameraPermission: 'idle',
  capturedImage: null,
};

// リデューサー
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_ONBOARDING_COMPLETE':
      return { ...state, isOnboardingComplete: action.payload };
    
    case 'SET_ANALYSIS_RESULT':
      return { 
        ...state, 
        currentAnalysis: action.payload,
        isLoading: false,
        error: null
      };
    
    case 'ADD_TO_HISTORY':
      return { 
        ...state, 
        analysisHistory: [action.payload, ...state.analysisHistory],
        isLoading: false,
        error: null
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload,
        isLoading: false
      };
    
    case 'SET_CAMERA_PERMISSION':
      return { ...state, cameraPermission: action.payload };
    
    case 'SET_CAPTURED_IMAGE':
      return { ...state, capturedImage: action.payload };
    
    case 'CLEAR_ANALYSIS':
      return { 
        ...state, 
        currentAnalysis: null,
        capturedImage: null,
        cameraPermission: 'idle'
      };
    
    case 'RESET_APP':
      return initialState;
    
    default:
      return state;
  }
}

// Context作成
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// カスタムフック
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// 便利なフック
export function useUser() {
  const { state, dispatch } = useApp();
  return {
    user: state.user,
    setUser: (user: User) => dispatch({ type: 'SET_USER', payload: user }),
    isOnboardingComplete: state.isOnboardingComplete,
    setOnboardingComplete: (complete: boolean) => 
      dispatch({ type: 'SET_ONBOARDING_COMPLETE', payload: complete }),
  };
}

export function useAnalysis() {
  const { state, dispatch } = useApp();
  return {
    currentAnalysis: state.currentAnalysis,
    analysisHistory: state.analysisHistory,
    setAnalysisResult: (result: AnalysisResult) => 
      dispatch({ type: 'SET_ANALYSIS_RESULT', payload: result }),
    addToHistory: (result: AnalysisResult) => 
      dispatch({ type: 'ADD_TO_HISTORY', payload: result }),
    clearAnalysis: () => dispatch({ type: 'CLEAR_ANALYSIS' }),
  };
}

export function useCamera() {
  const { state, dispatch } = useApp();
  return {
    cameraPermission: state.cameraPermission,
    capturedImage: state.capturedImage,
    setCameraPermission: (permission: 'idle' | 'requesting' | 'granted' | 'denied') => 
      dispatch({ type: 'SET_CAMERA_PERMISSION', payload: permission }),
    setCapturedImage: (image: string | null) => 
      dispatch({ type: 'SET_CAPTURED_IMAGE', payload: image }),
  };
}

export function useAppState() {
  const { state, dispatch } = useApp();
  return {
    isLoading: state.isLoading,
    error: state.error,
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    resetApp: () => dispatch({ type: 'RESET_APP' }),
  };
}
