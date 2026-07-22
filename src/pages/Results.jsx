import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

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
        <div className="card bg-red-50 border border-red-200 rounded-2xl max-w-2xl mx-auto p-8 shadow-sm">
          <h2 className="text-2xl font-heading font-bold text-red-800 mb-4">Invalid Results Link</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-mist rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-mist rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="card text-center mb-8 rounded-2xl border border-mist shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4 md:mb-6">
            Quiz Results - {results.userName}
          </h1>
          <div className="bg-gradient-to-r from-brand-blue to-brand-violet inline-block p-1 md:p-1.5 rounded-full shadow-brand mb-4">
            <div className="bg-white rounded-full p-6 md:p-8">
              <div className="text-4xl md:text-5xl font-heading font-bold text-brand-blue">
                {results.score}/{results.total}
              </div>
            </div>
          </div>
          <p className="mt-2 md:mt-4 text-base md:text-lg text-slate-body">
            <span className="font-medium text-ink">{results.quizTitle}</span> - {results.passage}
          </p>
        </div>

        {/* Detailed Results */}
        <div className="card rounded-2xl border border-mist shadow-lg p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-heading font-bold text-ink mb-6">Detailed Answers</h3>
          <div className="space-y-6">
            {results.answers.map((answer, index) => {
              const displayOptions = answer.activeOptions || answer.options;
              const optionLabels = ['A', 'B', 'C', 'D'];
              
              return (
                <div 
                  key={index} 
                  className={`border-2 rounded-2xl p-5 md:p-6 ${
                    answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start space-x-3 md:space-x-4 mb-4">
                    <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white ${
                      answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {answer.isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-base md:text-lg text-ink">
                        Question {index + 1}: {answer.question}
                      </h4>
                    </div>
                  </div>

                  <div className="ml-11 md:ml-14 space-y-2 md:space-y-3">
                    {displayOptions.map((option, optIndex) => {
                      let optionClass = 'text-slate-body';
                      let label = '';
                      let isSelected = false;
                      
                      if (optIndex === answer.correctAnswer) {
                        optionClass = 'text-green-700 font-medium';
                        label = ' ✓ Correct';
                        isSelected = true;
                      } else if (optIndex === answer.userAnswer && !answer.isCorrect) {
                        optionClass = 'text-red-700 font-medium';
                        label = ' ✗ Your answer';
                        isSelected = true;
                      }
                      
                      return (
                        <div key={optIndex} className={`text-sm md:text-base ${optionClass} ${isSelected ? 'bg-white/50 p-2 rounded-lg' : 'p-2'}`}>
                          <span className="font-semibold mr-2">
                            {optionLabels[optIndex]}.
                          </span>
                          {option}
                          <span className="ml-2 font-bold">{label}</span>
                        </div>
                      );
                    })}
                    
                    {answer.explanation && (
                      <div className="mt-4 p-4 bg-white rounded-xl border border-mist shadow-sm">
                        <strong className="text-ink font-heading">Explanation:</strong> 
                        <p className="text-slate-body mt-1 text-sm md:text-base">{answer.explanation}</p>
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