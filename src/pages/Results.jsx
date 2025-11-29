import React, { useState, useEffect } from 'react';

const Results = () => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      try {
        const jsonString = decodeURIComponent(escape(atob(hash)));
        const resultsData = JSON.parse(jsonString);
        setResults(resultsData);
      } catch (err) {
        setError('Invalid results link');
      }
    } else {
      setError('No results data found');
    }
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="card bg-red-50 border-red-200 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Invalid Results Link</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="card text-center mb-8">
          <h1 className="text-3xl font-bold text-bible-blue mb-4">
            Quiz Results - {results.userName}
          </h1>
          <div className="bg-gradient-to-r from-bible-blue to-bible-purple inline-block p-1 rounded-full">
            <div className="bg-white rounded-full p-6">
              <div className="text-4xl font-bold text-bible-blue">
                {results.score}/{results.total}
              </div>
            </div>
          </div>
          <p className="mt-4 text-lg text-gray-600">
            {results.quizTitle} - {results.passage}
          </p>
        </div>

        {/* Detailed Results */}
        <div className="card">
          <h3 className="text-2xl font-bold text-bible-blue mb-6">Detailed Answers</h3>
          <div className="space-y-6">
            {results.answers.map((answer, index) => {
              // Use activeOptions if available (for new quizzes), otherwise use all options (for backward compatibility)
              const displayOptions = answer.activeOptions || answer.options;
              const optionLabels = ['A', 'B', 'C', 'D'];
              
              return (
                <div 
                  key={index} 
                  className={`border-2 rounded-lg p-6 ${
                    answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start space-x-3 mb-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {answer.isCorrect ? '✓' : '✗'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        Question {index + 1}: {answer.question}
                      </h4>
                    </div>
                  </div>

                  <div className="ml-11 space-y-2">
                    {displayOptions.map((option, optIndex) => {
                      let optionClass = 'text-gray-700';
                      let label = '';
                      
                      if (optIndex === answer.correctAnswer) {
                        optionClass = 'text-green-700 font-semibold';
                        label = ' ✓ Correct';
                      } else if (optIndex === answer.userAnswer && !answer.isCorrect) {
                        optionClass = 'text-red-700 font-semibold';
                        label = ' ✗ Your answer';
                      }
                      
                      return (
                        <div key={optIndex} className={optionClass}>
                          <span className="font-semibold">
                            {optionLabels[optIndex]}.
                          </span>{' '}
                          {option}
                          {label}
                        </div>
                      );
                    })}
                    
                    {answer.explanation && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <strong>Explanation:</strong> {answer.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;