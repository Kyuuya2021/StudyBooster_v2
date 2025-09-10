'use client';

import { ReactNode } from 'react';

interface AIMessageProps {
  children: ReactNode;
  className?: string;
}

export function AIMessage({ children, className = '' }: AIMessageProps) {
  return (
    <div className={`flex items-start space-x-3 mb-6 ${className}`}>
      {/* AI Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>
      
      {/* Message Bubble */}
      <div className="flex-1">
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
          <p className="text-gray-800 leading-relaxed">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

