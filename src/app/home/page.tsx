'use client';

import { useRouter } from 'next/navigation';
import { HomeLayout } from '@/components/home/HomeLayout';

export default function HomePage() {
  const router = useRouter();

  const handleScanButtonClick = () => {
    router.push('/scan');
  };

  const handleLibraryButtonClick = () => {
    // TODO: 写真ライブラリ選択ページへ遷移する
    alert('写真ライブラリを開きます！');
  };

  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        {/* Main Content Area */}
        <main className="text-center max-w-md">
          <div className="mb-12">
            {/* AI Assistant Illustration */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-6xl">🤖</span>
              </div>
            </div>
            
            {/* Welcome Message */}
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              さあ、始めよう。
            </h2>
            <p className="text-gray-600 leading-relaxed">
              わからない問題は、AIが解決します。<br />
              写真を撮るだけで、すぐに答えが分かります。
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 w-full">
            {/* Primary Action - Camera Scan */}
            <button 
              onClick={handleScanButtonClick}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg text-lg"
            >
              📷 カメラで問題をスキャンする
            </button>
            
            {/* Secondary Action - Library */}
            <button
              onClick={handleLibraryButtonClick}
              className="w-full text-blue-600 hover:text-blue-700 transition-colors py-3 font-medium"
            >
              📁 写真フォルダから選ぶ
            </button>
          </div>
        </main>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 w-full max-w-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-500">解決済み</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-500">正解率</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-500">学習時間</div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
