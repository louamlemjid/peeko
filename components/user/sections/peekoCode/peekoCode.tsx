"use client"

import React, { useState } from 'react';

interface PeekoCodeProps {
  /** The verification code string to display and copy (e.g., "A1B2C3" or "123456") */
  code: string;
  /** Optional label above the code */
  label?: string;
  /** Optional additional className for the container */
  className?: string;
}

const PeekoCode: React.FC<PeekoCodeProps> = ({
  code,
  label = 'Verification Code',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={`relative max-w-md  ${className}`}>
      {label && (
        <p className="text-sm text-gray-600 mb-2 text-center">{label}</p>
      )}
      
      <div className="relative bg-transparent border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
        <div className="text-3xl md:text-4xl font-mono font-bold text-gray-200 tracking-widest select-all">
          {code.trim()}
        </div>

        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-md transition-colors duration-200 flex items-center gap-1.5"
          aria-label="Copy verification code"
        >
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PeekoCode;