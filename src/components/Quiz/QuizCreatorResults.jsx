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

  if (loading) {
    return <div className="text-center py-8">Loading results...</div>;
  }

  if (!results) {
    return <div className="text-center py-8">No results found for this quiz.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-bible-blue mb-4">Quiz Results: {quizTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-bible-blue">
              {new Date(results.lastUpdated).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">Last Updated</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-bible-blue mb-4">Participant Results</h3>
        <div className="space-y-4">
          {results.results.map((result, index) => (
            <div key={result.id || index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{result.userName}</h4>
                  <p className="text-sm text-gray-600">
                    Score: {result.score}/{result.total} ({Math.round((result.score / result.total) * 100)}%)
                  </p>
                  <p className="text-xs text-gray-500">
                    Completed: {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    (result.score / result.total) >= 0.7 ? 'text-green-600' : 
                    (result.score / result.total) >= 0.5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {Math.round((result.score / result.total) * 100)}%
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