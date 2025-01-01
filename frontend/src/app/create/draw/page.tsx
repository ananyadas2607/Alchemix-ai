// src/app/page.tsx
'use client';
import React from 'react';
import { Brush, Type } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="p-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Template Creator</h1>
          <nav>
            <Link href="/templates" className="text-gray-600 hover:text-gray-900">
              My Templates
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Website Template
          </h2>
          <p className="text-xl text-gray-600">
            Choose your preferred way to design your website template
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Drawing Interface Card */}
          <Link href="/create/draw" 
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 text-center cursor-pointer">
            <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-colors">
              <Brush className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Draw Your Design</h3>
            <p className="text-gray-600 mb-6">
              Use our interactive canvas to sketch your website layout and watch it transform into a template
            </p>
            <div className="bg-indigo-50 text-indigo-600 py-2 px-4 rounded-full inline-block group-hover:bg-indigo-100">
              Start Drawing
            </div>
          </Link>

          {/* Text Interface Card */}
          <Link href="/create/text"
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 text-center cursor-pointer">
            <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
              <Type className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Describe Your Design</h3>
            <p className="text-gray-600 mb-6">
              Simply describe your website in words and we'll generate a template based on your description
            </p>
            <div className="bg-purple-50 text-purple-600 py-2 px-4 rounded-full inline-block group-hover:bg-purple-100">
              Start Writing
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold text-center mb-12">Why Choose Our Template Creator?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Intuitive Design',
                description: 'Easy-to-use interface whether you prefer drawing or writing'
              },
              {
                title: 'Instant Preview',
                description: 'See your template take shape in real-time as you create'
              },
              {
                title: 'Customizable Output',
                description: 'Fine-tune your generated template to match your vision perfectly'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}