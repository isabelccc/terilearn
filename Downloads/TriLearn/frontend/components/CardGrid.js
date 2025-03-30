import ToolCard from './toolcard;'
import React from 'react';

const tools = {
  studying: [
    { title: 'Study Guide', description: 'Prepare for a test', icon: '📘' },
    { title: 'Practice Quiz', description: 'Test your knowledge', icon: '🧪' },
    { title: 'Flashcards', description: 'Bite-sized studying', icon: '🧠' },
  ],
  homework: [
    { title: 'Solve', description: 'Get answers and explanations', icon: '✅' },
    { title: 'Write', description: 'Draft paragraphs or papers', icon: '✍️' },
  ],
};

export default function CardGrid({ section }) {
  return (
    <div className="grid">
      {tools[section].map((tool, index) => (
        <ToolCard key={index} {...tool} />
      ))}
    </div>
  );
}