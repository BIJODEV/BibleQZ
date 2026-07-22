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
    return <div className="text-center py-8 text-slate-body font-medium animate-pulse">Loading results...</div>;
  }

  if (!results) {
    return <div className="text-center py-8 text-slate-body">No results found for this quiz.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card bg-white border border-mist rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-ink mb-6">Quiz Results: <span className="text-brand-blue">{quizTitle}</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-sky-tint-1 p-5 rounded-2xl text-center border border-mist/50">
            <div className="text-3xl font-heading font-bold text-brand-blue mb-1">{results.totalParticipants}</div>
            <div className="text-sm font-medium text-slate-body">Total Participants</div>
          </div>
          <div className="bg-green-50 p-5 rounded-2xl text-center border border-green-100">
            <div className="text-3xl font-heading font-bold text-green-700 mb-1">
              {results.results.length > 0 
                ? Math.round(results.results.reduce((acc, result) => acc + (result.score / result.total), 0) / results.results.length * 100)
                : 0}%
            </div>
            <div className="text-sm font-medium text-green-800/70">Average Score</div>
          </div>
          <div className="bg-sky-tint-2 p-5 rounded-2xl text-center border border-mist/50">
            <div className="text-lg md:text-xl font-heading font-bold text-brand-violet mb-1 flex items-center justify-center h-9">
              {new Date(results.lastUpdated).toLocaleDateString()}
            </div>
            <div className="text-sm font-medium text-slate-body">Last Updated</div>
          </div>
        </div>
      </div>

      <div className="card bg-white border border-mist rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-heading font-bold text-ink mb-6">Participant Results</h3>
        <div className="space-y-4">
          {results.results.map((result, index) => (
            <div key={result.id || index} className="border border-mist rounded-xl p-4 transition-colors hover:border-brand-blue/30">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-heading font-semibold text-ink">{result.userName}</h4>
                  <p className="text-sm text-slate-body mt-1">
                    Score: {result.score}/{result.total} ({Math.round((result.score / result.total) * 100)}%)
                  </p>
                  <p className="text-xs text-slate-body/70 mt-1">
                    Completed: {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-heading font-bold ${
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