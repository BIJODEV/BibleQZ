import React from 'react';
import MetaTags from '../components/SEO/MetaTags';
import QuizTaker from '../components/Quiz/QuizTaker';

const TakeQuiz = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <MetaTags 
        title="Take Quiz - BibleQ"
        description="Test your Bible knowledge with this interactive quiz. Answer questions, track your score, and learn more about Scripture."
      />
      
      <div className="max-w-4xl mx-auto">
        <QuizTaker />
      </div>
    </div>
  );
};

export default TakeQuiz;