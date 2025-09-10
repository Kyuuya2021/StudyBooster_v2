'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { HomeLayout } from '@/components/home/HomeLayout';
import { ErrorPage } from '@/components/ui/error-display';

export default function ErrorPageComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get('message') || '予期しないエラーが発生しました';

  const error = {
    code: 'PAGE_ERROR',
    message: message,
    userMessage: message,
    timestamp: new Date().toISOString(),
  };

  return (
    <HomeLayout>
      <ErrorPage
        error={error}
        onRetry={() => router.push('/scan')}
        onGoHome={() => router.push('/home')}
      />
    </HomeLayout>
  );
}
