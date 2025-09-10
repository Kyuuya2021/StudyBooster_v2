import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">SB</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800">StudyBooster</h1>
          <p className="text-xl text-gray-600">あなたの学習パートナー</p>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg text-gray-700 leading-relaxed">
            AIがあなたの学習をサポートし、目標達成まで一緒に頑張ります。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">学習計画</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">進捗管理</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">AI支援</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/onboarding"
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg text-lg"
          >
            はじめる
          </Link>
          
          <div className="text-sm text-gray-500">
            初回利用時はオンボーディングを行います
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            StudyBooster v2.0 - あなたの学習を加速させます
          </p>
        </div>
      </div>
    </div>
  );
}
