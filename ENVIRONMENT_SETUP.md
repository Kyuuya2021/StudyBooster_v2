# 環境設定ガイド

## 概要

StudyBooster v2.0では、環境別の設定管理とセキュリティ強化が実装されています。

## 1. 環境変数の設定

### 開発環境
プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、以下の内容を追加してください：

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# 環境設定
NODE_ENV=development
```

### 本番環境
本番環境では以下の環境変数が必須です：

```bash
# OpenAI API Configuration (必須)
OPENAI_API_KEY=your_openai_api_key_here

# 環境設定
NODE_ENV=production
```

## 2. OpenAI API の設定

### APIキーの取得
1. [OpenAI Platform](https://platform.openai.com/api-keys) にアクセス
2. アカウントを作成またはログイン
3. 「Create new secret key」をクリック
4. APIキーをコピーして保存

### 使用方法
- **APIキーあり**: 実際のOpenAI GPT-4 Vision APIを使用して画像解析
- **APIキーなし**: モックデータを使用してデモンストレーション

## 3. 環境別設定

### 開発環境
- ESLint/TypeScriptエラーを無視（開発効率向上）
- 圧縮無効（デバッグしやすさ）
- セキュリティヘッダー無効
- ホットリロード有効

### 本番環境
- 全セキュリティヘッダー有効
- 圧縮・最適化有効
- ソースマップ無効
- エラー検証厳格

## 4. セキュリティ設定

本番環境では以下のセキュリティ機能が自動的に有効になります：

- **CSP (Content Security Policy)**: XSS攻撃防止
- **HSTS**: HTTPS強制
- **X-Frame-Options**: クリックジャッキング防止
- **X-Content-Type-Options**: MIMEタイプスニッフィング防止

## 5. 料金について

OpenAI APIの使用には料金が発生します：
- GPT-4o: $0.01/1K tokens (入力), $0.03/1K tokens (出力)
- 画像解析: $0.01/画像

詳細は [OpenAI Pricing](https://openai.com/pricing) を確認してください。

## 6. トラブルシューティング

### APIキーが認識されない場合
1. `.env.local` ファイルが正しい場所にあるか確認
2. ファイル名にスペースや特殊文字がないか確認
3. 開発サーバーを再起動
4. 環境変数の検証ログを確認

### 本番環境でのエラー
1. 必須環境変数が設定されているか確認
2. セキュリティヘッダーが適切に設定されているか確認
3. APIキーが有効か確認

### 開発環境での問題
1. 開発用設定が適切に適用されているか確認
2. ホットリロードが有効になっているか確認
3. コンソールでエラーメッセージを確認

## 7. 設定のカスタマイズ

`src/lib/config.ts` ファイルで設定をカスタマイズできます：

- API設定の変更
- セキュリティ設定の調整
- アプリケーション設定の変更
- 環境別設定の追加
