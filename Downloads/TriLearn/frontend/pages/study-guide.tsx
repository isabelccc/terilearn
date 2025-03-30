'use client';

import React, { useRef, useState } from 'react';

const StudyGuide = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
    console.log('Dropped files:', files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    console.log('Selected files:', files);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Upload Study Materials</h2>
        <p className="text-sm text-gray-500 mb-4">Upload any documents or videos to start generating your study guide.</p>

        <div
          className={`border-2 border-dashed rounded-md p-8 text-center transition ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add files
          </button>
          <p className="text-sm text-gray-400 mt-2">or drag stuff here</p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4 text-left">
            <h4 className="text-sm font-semibold text-gray-600 mb-1">Files selected:</h4>
            <ul className="text-sm text-gray-700 list-disc list-inside">
              {selectedFiles.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyGuide;