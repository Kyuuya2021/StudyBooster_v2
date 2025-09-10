// 画像データの効率的な管理

import { config } from './config';

export interface ImageData {
  id: string;
  data: string; // Base64データ
  size: number;
  type: string;
  timestamp: string;
  compressed?: boolean;
}

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

// 画像管理クラス
export class ImageManager {
  private static instance: ImageManager;
  private imageCache: Map<string, ImageData> = new Map();
  private maxCacheSize = 5; // 最大キャッシュ数

  private constructor() {}

  static getInstance(): ImageManager {
    if (!ImageManager.instance) {
      ImageManager.instance = new ImageManager();
    }
    return ImageManager.instance;
  }

  // 画像の検証
  validateImage(file: File): { valid: boolean; error?: string } {
    // ファイルサイズチェック
    if (file.size > config.app.maxImageSize) {
      return {
        valid: false,
        error: `ファイルサイズが大きすぎます。${Math.round(config.app.maxImageSize / 1024 / 1024)}MB以下の画像を選択してください。`
      };
    }

    // ファイルタイプチェック
    if (!config.app.supportedImageTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'サポートされていない画像形式です。JPEG、PNG、WebP形式の画像を選択してください。'
      };
    }

    return { valid: true };
  }

  // ファイルをBase64に変換
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => {
        reject(new Error('ファイルの読み込みに失敗しました。'));
      };
      reader.readAsDataURL(file);
    });
  }

  // 画像の圧縮
  async compressImage(
    imageData: string,
    options: ImageProcessingOptions = {}
  ): Promise<string> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context could not be created'));
          return;
        }

        // アスペクト比を保持しながらリサイズ
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // 画像を描画
        ctx.drawImage(img, 0, 0, width, height);

        // 圧縮してBase64に変換
        const mimeType = `image/${format}`;
        const compressedData = canvas.toDataURL(mimeType, quality);
        resolve(compressedData);
      };

      img.onerror = () => {
        reject(new Error('画像の読み込みに失敗しました。'));
      };

      img.src = imageData;
    });
  }

  // 画像データの保存
  saveImage(imageData: string, options?: ImageProcessingOptions): string {
    const id = this.generateId();
    const size = this.getBase64Size(imageData);
    const type = this.getImageType(imageData);

    const image: ImageData = {
      id,
      data: imageData,
      size,
      type,
      timestamp: new Date().toISOString(),
      compressed: !!options,
    };

    // キャッシュに保存
    this.imageCache.set(id, image);

    // キャッシュサイズ制限
    if (this.imageCache.size > this.maxCacheSize) {
      const firstKey = this.imageCache.keys().next().value;
      this.imageCache.delete(firstKey);
    }

    return id;
  }

  // 画像データの取得
  getImage(id: string): ImageData | null {
    return this.imageCache.get(id) || null;
  }

  // 画像データの削除
  removeImage(id: string): boolean {
    return this.imageCache.delete(id);
  }

  // キャッシュのクリア
  clearCache(): void {
    this.imageCache.clear();
  }

  // 画像データの最適化（自動圧縮）
  async optimizeImage(file: File): Promise<{ id: string; data: ImageData }> {
    // 検証
    const validation = this.validateImage(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Base64に変換
    const base64Data = await this.fileToBase64(file);

    // 圧縮
    const compressedData = await this.compressImage(base64Data, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.8,
      format: 'jpeg'
    });

    // 保存
    const id = this.saveImage(compressedData, { quality: 0.8 });
    const imageData = this.getImage(id)!;

    return { id, data: imageData };
  }

  // 画像データのURL生成（一時的な表示用）
  createImageUrl(imageData: string): string {
    return imageData; // Base64データはそのままURLとして使用可能
  }

  // 画像データのクリーンアップ
  revokeImageUrl(url: string): void {
    // Base64データの場合は特に何もしない
    // Blob URLの場合は revokeObjectURL を呼ぶ
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }

  // ユーティリティ関数
  private generateId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getBase64Size(base64: string): number {
    // Base64のサイズを計算（概算）
    const base64Length = base64.length;
    const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
    return Math.round((base64Length * 3) / 4 - padding);
  }

  private getImageType(base64: string): string {
    const match = base64.match(/data:image\/([^;]+);/);
    return match ? match[1] : 'unknown';
  }

  // 画像データの統計情報
  getCacheStats(): {
    count: number;
    totalSize: number;
    images: Array<{ id: string; size: number; type: string; timestamp: string }>;
  } {
    const images = Array.from(this.imageCache.values());
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);

    return {
      count: this.imageCache.size,
      totalSize,
      images: images.map(img => ({
        id: img.id,
        size: img.size,
        type: img.type,
        timestamp: img.timestamp,
      })),
    };
  }
}

// シングルトンインスタンス
export const imageManager = ImageManager.getInstance();

// 便利なフック
export function useImageManager() {
  return {
    validateImage: (file: File) => imageManager.validateImage(file),
    optimizeImage: (file: File) => imageManager.optimizeImage(file),
    getImage: (id: string) => imageManager.getImage(id),
    removeImage: (id: string) => imageManager.removeImage(id),
    clearCache: () => imageManager.clearCache(),
    getCacheStats: () => imageManager.getCacheStats(),
  };
}
