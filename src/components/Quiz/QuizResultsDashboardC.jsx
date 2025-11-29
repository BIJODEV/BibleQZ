
import React, { useState, useEffect } from 'react';
import { listenToQuizResults } from '../../utils/firebaseQuiz';
import { getStoredQuizResults, clearQuizResults } from '../../utils/quizEncoder'; // Keep for fallback

const QuizResultsDashboard = ({ quizId, quizTitle, isFirebase = false }) => {
  const [results, setResults] = useState([]);
  const [sortedResults, setSortedResults] = useState([]);
  const [showExport, setShowExport] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to sort results by score (descending) and time (ascending)
  const sortResults = (resultsArray) => {
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

  useEffect(() => {
    if (!quizId) return;

    if (isFirebase) {
      // Firebase real-time listener
      console.log('Setting up Firebase listener for quiz:', quizId);
      const unsubscribe = listenToQuizResults(quizId, (firebaseResults) => {
        console.log('Firebase results received:', firebaseResults);
        const sorted = sortResults(firebaseResults || []);
        setResults(firebaseResults || []);
        setSortedResults(sorted);
        setLoading(false);
      });

      return () => {
        console.log('Cleaning up Firebase listener');
        unsubscribe();
      };
    } else {
      // Fallback to localStorage
      loadResults();
      const interval = setInterval(loadResults, 10000);
      return () => clearInterval(interval);
    }
  }, [quizId, isFirebase]);

  const loadResults = () => {
    const storedResults = getStoredQuizResults(quizId);
    const sorted = sortResults(storedResults);
    setResults(storedResults);
    setSortedResults(sorted);
    setLoading(false);
  };

  const clearResults = async () => {
    if (window.confirm('Are you sure you want to clear all results? This cannot be undone.')) {
      if (isFirebase) {
        // For Firebase, we can't easily clear from client-side
        // You might want to implement a cloud function for this
        alert('To clear Firebase results, you need to delete them manually from the Firebase console for now.');
      } else {
        clearQuizResults(quizId);
        setResults([]);
        setSortedResults([]);
      }
    }
  };

  const exportToCSV = () => {
    if (sortedResults.length === 0) return;

    const headers = ['Rank', 'Name', 'Score', 'Total', 'Percentage', 'Date', 'Time Taken', 'Completion Time'];
    const csvContent = [
      headers.join(','),
      ...sortedResults.map((result, index) => [
        index + 1,
        `"${result.userName.replace('"', '""')}"`,
        result.score,
        result.total,
        ((result.score / result.total) * 100).toFixed(1) + '%',
        new Date(result.timestamp).toLocaleDateString(),
        result.timeTaken ? `${result.timeTaken}s` : 'N/A',
        new Date(result.timestamp).toLocaleTimeString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bibleq-results-${quizTitle.replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify({
      quizTitle,
      exportedAt: new Date().toISOString(),
      results: sortedResults
    }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bibleq-results-${quizTitle.replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAverageScore = () => {
    if (sortedResults.length === 0) return 0;
    const total = sortedResults.reduce((sum, result) => sum + result.score, 0);
    return (total / sortedResults.length).toFixed(1);
  };

  const getScoreDistribution = () => {
    const distribution = { excellent: 0, good: 0, average: 0, poor: 0 };
    
    sortedResults.forEach(result => {
      const percentage = (result.score / result.total) * 100;
      if (percentage >= 90) distribution.excellent++;
      else if (percentage >= 70) distribution.good++;
      else if (percentage >= 50) distribution.average++;
      else distribution.poor++;
    });
    
    return distribution;
  };

  const formatTimeTaken = (timestamp) => {
    const start = new Date(timestamp);
    const end = new Date();
    const timeTaken = Math.round((end - start) / 1000); // Time in seconds
    
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const distribution = getScoreDistribution();

  return (
    <div className="card w-full max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-bible-blue text-center sm:text-left">
          {isFirebase ? '📊 Live Results Dashboard' : 'Quiz Results Dashboard'}
        </h2>

        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <button
            onClick={isFirebase ? () => window.location.reload() : loadResults}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => setShowExport(!showExport)}
            className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            📊 Export
          </button>
          <button
            onClick={clearResults}
            className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Live Indicator */}
      {isFirebase && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <span className="text-blue-600 mb-1 sm:mb-0">🔴</span>
            <span className="font-semibold text-blue-800">Live Updates Active</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Results will appear automatically as participants submit their quizzes.
            {loading && ' (Connecting...)'}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
          <div className="text-lg sm:text-2xl font-bold text-blue-600">{sortedResults.length}</div>
          <div className="text-xs sm:text-sm text-blue-800">Participants</div>
        </div>
        <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
          <div className="text-lg sm:text-2xl font-bold text-green-600">{getAverageScore()}</div>
          <div className="text-xs sm:text-sm text-green-800">Average Score</div>
        </div>
        <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg text-center">
          <div className="text-lg sm:text-2xl font-bold text-yellow-600">
            {sortedResults.length > 0 ? sortedResults[0].userName : 'N/A'}
          </div>
          <div className="text-xs sm:text-sm text-yellow-800">Current Winner</div>
        </div>
        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
          <div className="text-lg sm:text-2xl font-bold text-purple-600">{distribution.excellent}</div>
          <div className="text-xs sm:text-sm text-purple-800">Excellent (90%+)</div>
        </div>
        <div className="bg-red-50 p-3 sm:p-4 rounded-lg text-center">
          <div className="text-lg sm:text-2xl font-bold text-red-600">{distribution.poor}</div>
          <div className="text-xs sm:text-sm text-red-800">Needs Help (&lt;50%)</div>
        </div>
      </div>

      {/* Export Options */}
      {showExport && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Export Results</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={exportToCSV}
              disabled={sortedResults.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors w-full sm:w-auto"
            >
              📥 Export as CSV
            </button>
            <button
              onClick={exportToJSON}
              disabled={sortedResults.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors w-full sm:w-auto"
            >
              📥 Export as JSON
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && isFirebase && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bible-blue mx-auto"></div>
          <p className="text-gray-500 mt-4 text-sm sm:text-base">Connecting to live results...</p>
        </div>
      )}

      {/* Results Table */}
      {!loading && sortedResults.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-2 sm:p-3 text-center">Rank</th>
                <th className="border border-gray-200 p-2 sm:p-3 text-left">Name</th>
                <th className="border border-gray-200 p-2 sm:p-3 text-center">Score</th>
                <th className="border border-gray-200 p-2 sm:p-3 text-center">%</th>
                <th className="border border-gray-200 p-2 sm:p-3 text-center">Time Taken</th>
                <th className="border border-gray-200 p-2 sm:p-3 text-center">Completed At</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((result, index) => {
                const pct = (result.score / result.total) * 100;
                let color = pct >= 90 ? 'text-green-600' : pct >= 70 ? 'text-blue-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600';
                return (
                  <tr 
                    key={index} 
                    className={`hover:bg-gray-50 ${
                      index === 0 ? 'bg-yellow-50' : 
                      index === 1 ? 'bg-gray-50' : 
                      index === 2 ? 'bg-orange-50' : ''
                    }`}
                  >
                    <td className="border border-gray-200 p-2 sm:p-3 text-center font-bold">
                      <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-500 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          'bg-gray-300 text-gray-700'
                        }`}>
                          {index + 1}
                        </span>
                        {index === 0 && <span className="ml-1">👑</span>}
                      </div>
                    </td>
                    <td className="border border-gray-200 p-2 sm:p-3 font-medium">{result.userName}</td>
                    <td className={`border border-gray-200 p-2 sm:p-3 text-center font-bold ${color}`}>
                      {result.score}/{result.total}
                    </td>
                    <td className={`border border-gray-200 p-2 sm:p-3 text-center font-bold ${color}`}>
                      {pct.toFixed(1)}%
                    </td>
                    <td className="border border-gray-200 p-2 sm:p-3 text-center text-xs sm:text-sm">
                      {formatTimeTaken(result.timestamp)}
                    </td>
                    <td className="border border-gray-200 p-2 sm:p-3 text-center text-xs sm:text-sm">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : !loading && (
        <div className="text-center py-8 text-gray-500 px-2">
          <div className="text-5xl sm:text-6xl mb-4">📊</div>
          <p className="text-base sm:text-lg">{isFirebase ? 'Waiting for participants...' : 'No results yet.'}</p>
          <p className="text-xs sm:text-sm mt-2">
            {isFirebase 
              ? 'Share the quiz link. Results will appear here automatically.'
              : 'Share the quiz link and import their results.'
            }
          </p>
        </div>
      )}

      {/* Auto-refresh info */}
      {!isFirebase && !loading && (
        <p className="text-center mt-4 text-xs sm:text-sm text-gray-500">🔄 Auto-refreshing every 10 seconds</p>
      )}
    </div>
  );
};

export default QuizResultsDashboard;