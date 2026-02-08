
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Converter } from './components/Converter';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Fast, Private File Conversion
            </h1>
            <p className="text-lg text-gray-600">
              Transform your documents and images instantly. No registration required.
            </p>
          </div>
          
          <Converter />

          <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🔒"
              title="Secure Processing"
              description="Your files are processed on-the-fly and deleted immediately after conversion."
            />
            <FeatureCard 
              icon="⚡"
              title="Lightning Fast"
              description="Convert between PDF, Word, Excel, and images in seconds using optimized libraries."
            />
            <FeatureCard 
              icon="✨"
              title="High Quality"
              description="Preserve formatting and resolution across all supported conversion formats."
            />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="glass-effect p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default App;
