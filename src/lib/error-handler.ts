// エラーハンドリングの統一管理

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  userMessage: string;
}

export class CustomError extends Error {
  public code: string;
  public details?: Record<string, unknown>;
  public userMessage: string;

  constructor(code: string, message: string, userMessage: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.userMessage = userMessage;
    this.details = details;
  }
}

// エラーコード定義
export const ERROR_CODES = {
  // カメラ関連
  CAMERA_PERMISSION_DENIED: 'CAMERA_PERMISSION_DENIED',
  CAMERA_NOT_FOUND: 'CAMERA_NOT_FOUND',
  CAMERA_NOT_SUPPORTED: 'CAMERA_NOT_SUPPORTED',
  CAMERA_IN_USE: 'CAMERA_IN_USE',
  CAMERA_CONSTRAINT_ERROR: 'CAMERA_CONSTRAINT_ERROR',
  
  // 画像処理関連
  IMAGE_TOO_LARGE: 'IMAGE_TOO_LARGE',
  IMAGE_INVALID_FORMAT: 'IMAGE_INVALID_FORMAT',
  IMAGE_PROCESSING_FAILED: 'IMAGE_PROCESSING_FAILED',
  
  // API関連
  API_KEY_MISSING: 'API_KEY_MISSING',
  API_RATE_LIMIT: 'API_RATE_LIMIT',
  API_SERVER_ERROR: 'API_SERVER_ERROR',
  API_NETWORK_ERROR: 'API_NETWORK_ERROR',
  
  // 認証・認可関連
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // データ関連
  DATA_VALIDATION_ERROR: 'DATA_VALIDATION_ERROR',
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  
  // システム関連
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

// エラーメッセージマップ
const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.CAMERA_PERMISSION_DENIED]: 'カメラの使用が許可されていません。ブラウザの設定でカメラアクセスを許可してください。',
  [ERROR_CODES.CAMERA_NOT_FOUND]: 'カメラが見つかりません。カメラが接続されているか確認してください。',
  [ERROR_CODES.CAMERA_NOT_SUPPORTED]: 'このブラウザはカメラ機能をサポートしていません。',
  [ERROR_CODES.CAMERA_IN_USE]: 'カメラが他のアプリケーションで使用中です。',
  [ERROR_CODES.CAMERA_CONSTRAINT_ERROR]: 'カメラの設定が対応していません。別のカメラを試してください。',
  
  [ERROR_CODES.IMAGE_TOO_LARGE]: 'ファイルサイズが大きすぎます。10MB以下の画像を選択してください。',
  [ERROR_CODES.IMAGE_INVALID_FORMAT]: '画像ファイルを選択してください。',
  [ERROR_CODES.IMAGE_PROCESSING_FAILED]: '画像の処理中にエラーが発生しました。もう一度お試しください。',
  
  [ERROR_CODES.API_KEY_MISSING]: 'APIキーが設定されていません。管理者にお問い合わせください。',
  [ERROR_CODES.API_RATE_LIMIT]: 'APIの利用制限に達しました。しばらく待ってからもう一度お試しください。',
  [ERROR_CODES.API_SERVER_ERROR]: 'サーバーエラーが発生しました。しばらく待ってからもう一度お試しください。',
  [ERROR_CODES.API_NETWORK_ERROR]: 'ネットワークエラーが発生しました。インターネット接続を確認してください。',
  
  [ERROR_CODES.UNAUTHORIZED]: '認証が必要です。ログインしてください。',
  [ERROR_CODES.FORBIDDEN]: 'この操作を実行する権限がありません。',
  
  [ERROR_CODES.DATA_VALIDATION_ERROR]: '入力データに問題があります。内容を確認してください。',
  [ERROR_CODES.DATA_NOT_FOUND]: 'データが見つかりません。',
  
  [ERROR_CODES.UNKNOWN_ERROR]: '予期しないエラーが発生しました。',
  [ERROR_CODES.NETWORK_ERROR]: 'ネットワークエラーが発生しました。インターネット接続を確認してください。',
};

// エラーハンドラー関数
export function handleError(error: unknown): AppError {
  const timestamp = new Date().toISOString();
  
  // カスタムエラーの場合
  if (error instanceof CustomError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp,
      userMessage: error.userMessage,
    };
  }
  
  // DOMException（カメラ関連エラー）
  if (error instanceof DOMException) {
    let code: string;
    let userMessage: string;
    
    switch (error.name) {
      case 'NotAllowedError':
        code = ERROR_CODES.CAMERA_PERMISSION_DENIED;
        userMessage = ERROR_MESSAGES[code];
        break;
      case 'NotFoundError':
        code = ERROR_CODES.CAMERA_NOT_FOUND;
        userMessage = ERROR_MESSAGES[code];
        break;
      case 'NotSupportedError':
        code = ERROR_CODES.CAMERA_NOT_SUPPORTED;
        userMessage = ERROR_MESSAGES[code];
        break;
      case 'NotReadableError':
        code = ERROR_CODES.CAMERA_IN_USE;
        userMessage = ERROR_MESSAGES[code];
        break;
      case 'OverconstrainedError':
        code = ERROR_CODES.CAMERA_CONSTRAINT_ERROR;
        userMessage = ERROR_MESSAGES[code];
        break;
      default:
        code = ERROR_CODES.UNKNOWN_ERROR;
        userMessage = ERROR_MESSAGES[code];
    }
    
    return {
      code,
      message: error.message,
      details: { name: error.name },
      timestamp,
      userMessage,
    };
  }
  
  // 標準的なError
  if (error instanceof Error) {
    // ネットワークエラーの判定
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        code: ERROR_CODES.NETWORK_ERROR,
        message: error.message,
        timestamp,
        userMessage: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
      };
    }
    
    return {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: error.message,
      timestamp,
      userMessage: ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
    };
  }
  
  // その他のエラー
  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: String(error),
    timestamp,
    userMessage: ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
  };
}

// エラーログ記録
export function logError(error: AppError, context?: string) {
  console.error(`[${error.code}] ${error.message}`, {
    context,
    details: error.details,
    timestamp: error.timestamp,
  });
  
  // 本番環境では外部ログサービスに送信
  if (process.env.NODE_ENV === 'production') {
    // TODO: 外部ログサービス（Sentry等）への送信
    // logToExternalService(error, context);
  }
}

// エラー表示用のフック
export function useErrorHandler() {
  const handleErrorWithLogging = (error: unknown, context?: string) => {
    const appError = handleError(error);
    logError(appError, context);
    return appError;
  };
  
  return { handleErrorWithLogging };
}

// エラー表示用のコンポーネント用データ
export function getErrorDisplayData(error: AppError) {
  return {
    title: 'エラーが発生しました',
    message: error.userMessage,
    code: error.code,
    timestamp: error.timestamp,
    canRetry: [
      ERROR_CODES.CAMERA_PERMISSION_DENIED,
      ERROR_CODES.CAMERA_NOT_FOUND,
      ERROR_CODES.CAMERA_IN_USE,
      ERROR_CODES.IMAGE_PROCESSING_FAILED,
      ERROR_CODES.API_RATE_LIMIT,
      ERROR_CODES.API_SERVER_ERROR,
      ERROR_CODES.NETWORK_ERROR,
    ].includes(error.code as keyof typeof ERROR_CODES),
  };
}
