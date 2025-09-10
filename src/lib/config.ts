// 環境設定管理
export const config = {
  // 環境判定
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // API設定
  api: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o',
      maxTokens: 2000,
      temperature: 0.3,
    },
  },
  
  // アプリケーション設定
  app: {
    name: 'StudyBooster',
    version: '2.0.0',
    description: 'AI-powered learning companion',
    maxImageSize: 10 * 1024 * 1024, // 10MB
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  
  // セキュリティ設定
  security: {
    enableCSP: process.env.NODE_ENV === 'production',
    enableHSTS: process.env.NODE_ENV === 'production',
    enableXSSProtection: true,
  },
  
  // 開発環境専用設定
  development: {
    enableMockData: !process.env.OPENAI_API_KEY,
    enableDebugLogs: true,
    enableHotReload: true,
  },
  
  // 本番環境専用設定
  production: {
    enableCompression: true,
    enableMinification: true,
    enableSourceMaps: false,
  },
} as const;

// 環境変数の検証
export function validateEnvironment() {
  const errors: string[] = [];
  
  // 本番環境での必須環境変数チェック
  if (config.isProduction) {
    if (!config.api.openai.apiKey) {
      errors.push('OPENAI_API_KEY is required in production');
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.join(', ')}`);
  }
  
  return true;
}

// 設定の取得（型安全）
export function getConfig<T extends keyof typeof config>(key: T): typeof config[T] {
  return config[key];
}

// 開発環境かどうかの判定
export function isDevelopment(): boolean {
  return config.isDevelopment;
}

// 本番環境かどうかの判定
export function isProduction(): boolean {
  return config.isProduction;
}
