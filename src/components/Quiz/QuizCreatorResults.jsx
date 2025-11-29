import React, { useState, useEffect } from 'react';
import { getQuizResultsFromFirestore } from '../../utils/firebaseQuiz';

const QuizCreatorResults = ({ quizId, quizTitle }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [quizId]);

  const loadResults = async () => {
    setLoading(true);
    const resultsData = await getQuizResultsFromFirestore(quizId);
    setResults(resultsData);
    setLoading(false);
  };

  // Function to sort results by score (descending) and time (ascending)
  const getSortedResults = (resultsArray) => {
    if (!resultsArray || resultsArray.length === 0) return [];
    
    return [...resultsArray].sort((a, b) => {
      // First compare by score (higher score first)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are equal, compare by timestamp (earlier submission first)
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
  };

  const formatTimeTaken = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const timeTaken = Math.round((end - start) / 1000); // Time in seconds
    
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading results...</div>;
  }

  if (!results) {
    return <div className="text-center py-8">No results found for this quiz.</div>;
  }

  const sortedResults = getSortedResults(results.results);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-bible-blue mb-4">Quiz Results: {quizTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-bible-blue">{results.totalParticipants}</div>
            <div className="text-sm text-gray-600">Total Participants</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-bible-blue">
              {results.results.length > 0 
                ? Math.round(results.results.reduce((acc, result) => acc + (result.score / result.total), 0) / results.results.length * 100)
                : 0}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-bible-blue">
              {sortedResults.length > 0 ? sortedResults[0].userName : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Current Winner</div>
          </div>
          {/* <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-bible-blue">
              {new Date(results.lastUpdated).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">Last Updated</div>
          </div> */}
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-bible-blue mb-4">
          🏆 Participant Results
        </h3>
        <div className="space-y-3">
          {sortedResults.map((result, index) => (
            <div 
              key={result.id || index} 
              className={`border rounded-lg p-4 ${
                index === 0 ? 'bg-yellow-50 border-yellow-300 border-2' :
                index === 1 ? 'bg-gray-50 border-gray-300' :
                index === 2 ? 'bg-orange-50 border-orange-300' :
                'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {/* Rank Badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-500 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-gray-300 text-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold flex items-center">
                      {result.userName}
                      {index === 0 && <span className="ml-2">👑</span>}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Score: {result.score}/{result.total} ({Math.round((result.score / result.total) * 100)}%)
                    </p>
                    <p className="text-xs text-gray-500">
                      Time: {formatTimeTaken(result.timestamp, result.completedAt)} • 
                      Completed: {new Date(result.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    (result.score / result.total) >= 0.7 ? 'text-green-600' : 
                    (result.score / result.total) >= 0.5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {Math.round((result.score / result.total) * 100)}%
                  </div>
                  <div className="text-sm text-gray-500">
                    Rank #{index + 1}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizCreatorResults;