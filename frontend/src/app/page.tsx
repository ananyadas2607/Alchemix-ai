'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DrawingPad from '@/components/DrawingPad';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-800 to-purple-900 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
              Create Your Website with AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Transform your ideas into a stunning website in minutes. Our AI-powered platform helps you create beautiful, responsive websites with just a few clicks.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-6">
              <p className="text-gray-300 text-lg">Choose how you want to create:</p>
              <div className="flex gap-4">
                <a href="/create/text" 
                   className="group relative rounded-2xl px-8 py-4 text-lg font-semibold text-white bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Describe in Text
                  </div>
                </a>
                <a href="/create/draw"
                   className="group relative rounded-2xl px-8 py-4 text-lg font-semibold text-white bg-gradient-to-br from-pink-600 to-purple-800 hover:from-pink-500 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-pink-500/25">
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Draw Layout
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-800 to-purple-900 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        </div>
      </div>
    </main>
  );
}