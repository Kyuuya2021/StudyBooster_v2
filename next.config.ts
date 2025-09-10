import type { NextConfig } from "next";

// セキュリティヘッダー設定
function getSecurityHeaders() {
  return [
    {
      key: 'X-DNS-Prefetch-Control',
      value: 'on'
    },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload'
    },
    {
      key: 'X-XSS-Protection',
      value: '1; mode=block'
    },
    {
      key: 'X-Frame-Options',
      value: 'SAMEORIGIN'
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff'
    },
    {
      key: 'Referrer-Policy',
      value: 'origin-when-cross-origin'
    },
    {
      key: 'Content-Security-Policy',
      value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self' https://api.openai.com;"
    }
  ];
}

const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // 本番環境でのセキュリティヘッダー設定
  ...(isDevelopment ? {} : {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: getSecurityHeaders()
        }
      ];
    }
  }),
  
  // Turbopack設定（開発環境のみ）
  ...(isDevelopment ? {
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    }
  } : {}),
  
  // 開発環境での警告を抑制（開発環境のみ）
  ...(isDevelopment ? {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    compress: false,
  } : {
    // 本番環境では適切な設定を有効化
    eslint: {
      ignoreDuringBuilds: false,
    },
    typescript: {
      ignoreBuildErrors: false,
    },
    compress: true,
  }),
  
  // 本番環境での最適化設定
  ...(isDevelopment ? {} : {
    poweredByHeader: false,
    generateEtags: true,
  }),
};

export default nextConfig;
