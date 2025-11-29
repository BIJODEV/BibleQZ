import React, { useState, useEffect } from 'react';
import { getUserQuizzesWithResults, getQuizResultsFromFirestore, calculateWinners } from '../../utils/firebaseQuiz';
import { useAuth } from '../../contexts/AuthContext';

const QuizHistory = ({ onSelectQuiz, onClose }) => {
  const { user } = useAuth();
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'results'

  useEffect(() => {
    loadQuizHistory();
  }, [user]);

  const loadQuizHistory = async () => {
    if (user) {
      const history = await getUserQuizzesWithResults(user.uid);
      // Sort quizzes by creation date, most recent first
      const sortedHistory = history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setQuizHistory(sortedHistory);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeTaken = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Sort results by score and time
  const sortResults = (results) => {
    if (!results || results.length === 0) return [];
    
    const resultsWithTime = results.map(result => ({
      ...result,
      timeTaken: result.timeTaken || 0,
      percentage: ((result.score / result.total) * 100).toFixed(1)
    }));
    
    // Sort by score (desc) then time (asc)
    const sorted = [...resultsWithTime].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeTaken - b.timeTaken;
    });
    
    // Add ranking
    let currentRank = 1;
    let skipCount = 0;
    
    return sorted.map((result, index) => {
      if (index === 0) {
        return { ...result, rank: 1 };
      }
      
      const prevResult = sorted[index - 1];
      
      if (result.score === prevResult.score && result.timeTaken === prevResult.timeTaken) {
        skipCount++;
        return { ...result, rank: currentRank };
      } else {
        currentRank = currentRank + 1 + skipCount;
        skipCount = 0;
        return { ...result, rank: currentRank };
      }
    });
  };

  const viewResults = async (quiz) => {
    // Sort the results before displaying
    const sortedResults = sortResults(quiz.results || []);
    setSelectedQuiz({
      ...quiz,
      sortedResults: sortedResults
    });
    setViewMode('results');
  };

  const closeResults = () => {
    setSelectedQuiz(null);
    setViewMode('list');
  };

  const refreshResults = async () => {
    if (selectedQuiz) {
      const updatedResults = await getQuizResultsFromFirestore(selectedQuiz.id);
      const sortedResults = sortResults(updatedResults?.results || []);
      setSelectedQuiz(prev => ({
        ...prev,
        results: updatedResults?.results || [],
        sortedResults: sortedResults,
        totalParticipants: updatedResults?.totalParticipants || 0
      }));
    }
  };

  const getRankingBadge = (rank) => {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankingColor = (rank) => {
    switch(rank) {
      case 1: return 'bg-yellow-50 border-l-4 border-l-yellow-400';
      case 2: return 'bg-gray-50 border-l-4 border-l-gray-400';
      case 3: return 'bg-orange-50 border-l-4 border-l-orange-400';
      default: return 'bg-white border-l-4 border-l-transparent';
    }
  };

  const getScoreColor = (percentage) => {
    return percentage >= 90 ? 'text-green-600' : 
           percentage >= 70 ? 'text-blue-600' : 
           percentage >= 50 ? 'text-yellow-600' : 'text-red-600';
  };

  const getProgressBarColor = (percentage) => {
    return percentage >= 90 ? 'bg-green-500' : 
           percentage >= 70 ? 'bg-yellow-500' : 
           percentage >= 50 ? 'bg-blue-500' : 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Results View
  if (viewMode === 'results' && selectedQuiz) {
    const sortedResults = selectedQuiz.sortedResults || [];
    const winner = sortedResults.length > 0 ? sortedResults[0] : null;
    const averageScore = sortedResults.length > 0 
      ? Math.round(sortedResults.reduce((acc, result) => acc + (result.score / result.total), 0) / sortedResults.length * 100)
      : 0;

    return (
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-bible-blue">Quiz Results</h3>
            <p className="text-sm text-gray-600">{selectedQuiz.title} - {selectedQuiz.passage}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={refreshResults}
              className="btn-secondary text-sm px-3 py-1"
            >
              🔄 Refresh
            </button>
            <button
              onClick={closeResults}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Results Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
            <div className="text-2xl font-bold text-bible-blue">{selectedQuiz.totalParticipants || 0}</div>
            <div className="text-sm text-gray-600">Total Participants</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
            <div className="text-2xl font-bold text-bible-blue">
              {averageScore}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
            <div className="text-2xl font-bold text-bible-blue">
              {winner ? winner.userName : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Winner 🏆</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
            <div className="text-2xl font-bold text-bible-blue">
              {sortedResults.length}
            </div>
            <div className="text-sm text-gray-600">Submissions</div>
          </div>
        </div>

        {/* Winner Banner */}
        {winner && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🥇</span>
                <div>
                  <h3 className="font-bold text-yellow-800">Top Performer</h3>
                  <p className="text-yellow-700 text-sm">
                    {winner.userName} - {winner.score}/{winner.total} ({((winner.score / winner.total) * 100).toFixed(1)}%) in {formatTimeTaken(winner.timeTaken)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-yellow-600">Rank #1</p>
                <p className="text-sm font-semibold text-yellow-700">Congratulations! 🎉</p>
              </div>
            </div>
          </div>
        )}

        {/* Participant Results */}
        <div>
          <h4 className="font-semibold text-bible-blue mb-4">
            🏆 Participant Results (Sorted by Score & Time)
          </h4>
          {sortedResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <p>No results yet</p>
              <p className="text-sm mt-2">Participants' results will appear here as they complete the quiz</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sortedResults.map((result) => {
                const percentage = (result.score / result.total) * 100;
                
                return (
                  <div 
                    key={result.id || result.userName} 
                    className={`border rounded-lg p-4 transition-colors ${getRankingColor(result.rank)}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3 flex-1">
                        {/* Rank Badge */}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-white border-2 border-current text-sm">
                          {getRankingBadge(result.rank)}
                        </div>
                        
                        <div className="flex-1">
                          <h5 className="font-semibold text-bible-blue flex items-center">
                            {result.userName}
                            {result.rank === 1 && <span className="ml-2">👑</span>}
                          </h5>
                          <div className="text-sm text-gray-600 mt-1">
                            Score: {result.score}/{result.total} ({percentage.toFixed(1)}%)
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Completed: {formatDate(result.timestamp)}
                            {result.timeTaken && ` • Time: ${formatTimeTaken(result.timeTaken)}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(percentage)}`}>
                          {percentage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          Rank #{result.rank}
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-2 ml-11">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressBarColor(percentage)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-bible-blue">Your Quiz History</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {quizHistory.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📚</div>
          <p>No quiz history yet</p>
          <p className="text-sm mt-2">Your recently created quizzes will appear here</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {quizHistory.map((quiz, index) => {
            const sortedResults = sortResults(quiz.results || []);
            const winner = sortedResults.length > 0 ? sortedResults[0] : null;
            
            return (
              <div
                key={quiz.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-bible-blue">{quiz.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {quiz.passage} • {quiz.questions.length} questions
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Created {formatDate(quiz.createdAt)}
                      {quiz.lastUpdated && ` • Updated ${formatDate(quiz.lastUpdated)}`}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    #{index + 1}
                  </span>
                </div>
                
                {/* Quiz Stats */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>👥 {quiz.totalParticipants || 0} participants</span>
                    <span>📊 {sortedResults.length} submissions</span>
                    {winner && (
                      <span className="text-yellow-600 font-semibold">
                        🏆 Winner: {winner.userName}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => viewResults(quiz)}
                    className="btn-primary text-sm px-3 py-1 flex items-center space-x-1"
                    disabled={!quiz.results || quiz.results.length === 0}
                  >
                    <span>📊</span>
                    <span>View Results</span>
                    {sortedResults.length > 0 && (
                      <span className="bg-white text-bible-blue text-xs px-1 rounded">
                        {sortedResults.length}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => onSelectQuiz(quiz)}
                    className="btn-secondary text-sm px-3 py-1 flex items-center space-x-1"
                  >
                    <span>🔄</span>
                    <span>Use Again</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(quiz.shareLink);
                      alert('Quiz link copied to clipboard!');
                    }}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors flex items-center space-x-1"
                  >
                    <span>📋</span>
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuizHistory;