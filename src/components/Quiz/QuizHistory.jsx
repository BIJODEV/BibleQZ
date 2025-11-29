import React, { useState, useEffect } from 'react';
import { getUserQuizzesWithResults, getQuizResultsFromFirestore } from '../../utils/firebaseQuiz';
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
      setQuizHistory(history);
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

  const viewResults = async (quiz) => {
    setSelectedQuiz(quiz);
    setViewMode('results');
  };

  const closeResults = () => {
    setSelectedQuiz(null);
    setViewMode('list');
  };

  const refreshResults = async () => {
    if (selectedQuiz) {
      const updatedResults = await getQuizResultsFromFirestore(selectedQuiz.id);
      setSelectedQuiz(prev => ({
        ...prev,
        results: updatedResults?.results || [],
        totalParticipants: updatedResults?.totalParticipants || 0
      }));
    }
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

        {/* Results Statistics - Update the grid to show winner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
              <div className="text-2xl font-bold text-bible-blue">{selectedQuiz.totalParticipants || 0}</div>
              <div className="text-sm text-gray-600">Total Participants</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
              <div className="text-2xl font-bold text-bible-blue">
                {selectedQuiz.results.length > 0 
                  ? Math.round(selectedQuiz.results.reduce((acc, result) => acc + (result.score / result.total), 0) / selectedQuiz.results.length * 100)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
              <div className="text-2xl font-bold text-bible-blue">
                {selectedQuiz.results.length > 0 ? selectedQuiz.results[0].userName : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Winner</div>
            </div>
            {/* <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
              <div className="text-2xl font-bold text-bible-blue">
                {selectedQuiz.lastUpdated ? formatDate(selectedQuiz.lastUpdated) : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Last Updated</div>
            </div> */}
          </div>

        {/* Participant Results */}
          <div>
            <h4 className="font-semibold text-bible-blue mb-4">
              🏆 Participant Results
            </h4>
            {selectedQuiz.results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📊</div>
                <p>No results yet</p>
                <p className="text-sm mt-2">Participants' results will appear here as they complete the quiz</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedQuiz.results.map((result, index) => (
                  <div 
                    key={result.id || index} 
                    className={`border rounded-lg p-4 ${
                      index === 0 ? 'bg-yellow-50 border-yellow-300 border-2' :
                      index === 1 ? 'bg-gray-50 border-gray-300' :
                      index === 2 ? 'bg-orange-50 border-orange-300' :
                      'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3 flex-1">
                        {/* Rank Badge */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-500 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          'bg-gray-300 text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <h5 className="font-semibold text-bible-blue flex items-center">
                            {result.userName}
                            {index === 0 && <span className="ml-2">👑</span>}
                          </h5>
                          <div className="text-sm text-gray-600 mt-1">
                            Score: {result.score}/{result.total} ({Math.round((result.score / result.total) * 100)}%)
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Completed: {formatDate(result.timestamp)}
                            {result.timeTaken && ` • Time: ${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          (result.score / result.total) >= 0.7 ? 'text-green-600' : 
                          (result.score / result.total) >= 0.5 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {Math.round((result.score / result.total) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          Rank #{index + 1}
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-2 ml-11">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (result.score / result.total) >= 0.7 ? 'bg-green-500' : 
                            (result.score / result.total) >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(result.score / result.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
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
          {quizHistory.map((quiz, index) => (
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
                  <span>📊 {quiz.results?.length || 0} submissions</span>
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
                  {quiz.results?.length > 0 && (
                    <span className="bg-white text-bible-blue text-xs px-1 rounded">
                      {quiz.results.length}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizHistory;