// import React, { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../components/SEO/MetaTags';
import QuizCreator from '../components/Quiz/QuizCreator';

const CreateQuiz = () => {
  return (
    <div className="container mx-auto px-4 py-8">
    <MetaTags 
        title="Create Bible Quiz - BibleQ Quiz Maker"
        description="Create custom Bible quizzes with multiple-choice questions. Perfect for Sunday school, small groups, and Bible study sessions."
      />
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-bible-blue">Home</Link>
          <span>›</span>
          <span className="text-bible-blue font-medium">Create Quiz</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-bible-blue mb-4">
            Create Bible Quiz
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build a quiz for your Bible study group. Share the link and track responses.
          </p>
        </div>

        <QuizCreator />
      </div>
    </div>
  );
};

export default CreateQuiz;