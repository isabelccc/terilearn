// app/onboarding/page.tsx

'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);

 
  const handleCardClick = (title: string) => {
    if (title === 'Study guide') {
      // Just redirect to /study-guide
      router.push('/study-guide');
    } else {
      const card = cards.find((c) => c.title === title);
      if (card) router.push(card.path);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
   
  };

  const cards = [
    { title: 'Study guide', desc: 'Prepare for a test', path: '/study-guide' },
    { title: 'Practice quiz', desc: 'Test your knowledge', path: '/quiz' },
    { title: 'Flashcards', desc: 'Bite-sized studying', path: '/flashcards' },
    { title: 'Solve', desc: 'Get answers and explanations', path: '/solve' },
    { title: 'Write', desc: 'Draft paragraphs or papers', path: '/write' },
    { title: 'Code', desc: 'Practice coding skills here', path: '/code' },
  ];

  return (
    <div
      className={`min-h-screen bg-gray-100 p-6 ${isDragging ? 'bg-blue-50' : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <h1 className="text-2xl text-black font-bold mb-6">TriLearn</h1>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ title, desc }) => (
          <div
            key={title}
            onClick={() => handleCardClick(title)}
            className="cursor-pointer p-6 bg-white rounded-lg shadow hover:bg-gray-50"
          >
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </div>

      {isDragging && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center text-lg font-semibold text-blue-600">
          Drop files to upload
        </div>
      )}
    </div>
  );
};

export default Dashboard;