import React, { useState, useEffect } from 'react';
import { getQuizResultsFromFirestore, calculateWinners } from '../utils/firebaseQuiz';

const Results = () => {
  const [results, setResults] = useState(null);
  const [allResults, setAllResults] = useState(null);
  const [error, setError] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      try {
        const jsonString = decodeURIComponent(escape(atob(hash)));
        const resultsData = JSON.parse(jsonString);
        setResults(resultsData);
        
        // Fetch all results to show leaderboard
        fetchAllResults(resultsData.quizId);
      } catch (err) {
        setError('Invalid results link');
      }
    } else {
      setError('No results data found');
    }
  }, []);

  const fetchAllResults = async (quizId) => {
    try {
      const quizData = await getQuizResultsFromFirestore(quizId);
      if (quizData) {
        setAllResults(quizData);
      }
    } catch (err) {
      console.error('Error fetching all results:', err);
    }
  };

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
        {/* Personal Results */}
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
          
          {/* Show leaderboard button if we have all results */}
          {allResults && (
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="mt-4 bg-bible-blue text-white px-6 py-2 rounded-lg hover:bg-bible-purple transition-colors"
            >
              {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
            </button>
          )}
        </div>

        {/* Leaderboard Section */}
        {showLeaderboard && allResults && (
          <div className="card mb-8">
            <h3 className="text-2xl font-bold text-bible-blue mb-6 text-center">
              🏆 Leaderboard
            </h3>
            <div className="space-y-3">
              {calculateWinners(allResults.results).map((result, index) => (
                <div
                  key={result.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    index === 0
                      ? 'bg-yellow-50 border-yellow-300'
                      : index === 1
                      ? 'bg-gray-50 border-gray-300'
                      : index === 2
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-white border-gray-200'
                  } ${result.userName === results.userName ? 'ring-2 ring-bible-blue' : ''}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0
                        ? 'bg-yellow-500 text-white'
                        : index === 1
                        ? 'bg-gray-500 text-white'
                        : index === 2
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <span className="font-semibold">
                        {result.userName}
                        {result.userName === results.userName && ' (You)'}
                      </span>
                      {index === 0 && <span className="ml-2">👑</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{result.score}/{result.total}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Winner Announcement */}
            {allResults.results && allResults.results.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <h4 className="font-bold text-green-800 text-lg mb-2">
                  🎉 Congratulations!
                </h4>
                <p className="text-green-700">
                  <strong>{calculateWinners(allResults.results)[0].userName}</strong> is the winner with {calculateWinners(allResults.results)[0].score} points!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Detailed Results */}
        <div className="card">
          <h3 className="text-2xl font-bold text-bible-blue mb-6">Detailed Answers</h3>
          <div className="space-y-6">
            {results.answers.map((answer, index) => {
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