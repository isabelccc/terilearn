'use client';

import React from 'react';
import FileUpload from '../components/FileUpload';

const StudyGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Study Materials</h2>
        <p className="text-gray-600 mb-6">Upload any documents or videos to start generating your study guide.</p>
        
        <FileUpload />
      </div>
    </div>
  );
};

export default StudyGuide;