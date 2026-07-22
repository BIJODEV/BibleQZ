import React, { useState, useEffect } from 'react';
import { RefreshCw, X, BarChart3, BookOpen, Copy, Users, PlayCircle } from 'lucide-react';
import { getUserQuizzesWithResults, getQuizResultsFromFirestore } from '../../utils/firebaseQuiz';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';

const QuizHistory = ({ onSelectQuiz, onClose }) => {
  const { user } = useAuth();
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'results'

  useEffect(() => {
    loadQuizHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="card bg-white border border-mist rounded-2xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-mist rounded w-3/4"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-mist rounded-xl p-4">
              <div className="h-4 bg-mist rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-mist rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Results View
  if (viewMode === 'results' && selectedQuiz) {
    return (
      <div className="card bg-white border border-mist rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-heading font-bold text-ink">Quiz Results</h3>
            <p className="text-sm text-slate-body mt-1">{selectedQuiz.title} - {selectedQuiz.passage}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              onClick={refreshResults}
              className="text-xs px-3 py-1.5 h-auto"
            >
              <RefreshCw className="w-3 h-3 mr-1.5" />
              Refresh
            </Button>
            <button
              onClick={closeResults}
              className="text-slate-body hover:text-ink p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-sky-tint-1 p-4 rounded-xl text-center border border-mist/50">
            <div className="text-2xl font-heading font-bold text-brand-blue mb-1">{selectedQuiz.totalParticipants || 0}</div>
            <div className="text-xs font-medium text-slate-body">Total Participants</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
            <div className="text-2xl font-heading font-bold text-green-700 mb-1">
              {selectedQuiz.results.length > 0 
                ? Math.round(selectedQuiz.results.reduce((acc, result) => acc + (result.score / result.total), 0) / selectedQuiz.results.length * 100)
                : 0}%
            </div>
            <div className="text-xs font-medium text-green-800/70">Average Score</div>
          </div>
          <div className="bg-sky-tint-2 p-4 rounded-xl text-center border border-mist/50">
            <div className="text-sm font-heading font-bold text-brand-violet mb-1 flex items-center justify-center h-8">
              {selectedQuiz.lastUpdated ? formatDate(selectedQuiz.lastUpdated) : 'N/A'}
            </div>
            <div className="text-xs font-medium text-slate-body">Last Updated</div>
          </div>
        </div>

        {/* Participant Results */}
        <div>
          <h4 className="font-heading font-semibold text-ink mb-4">Participant Results</h4>
          {selectedQuiz.results.length === 0 ? (
            <div className="text-center py-12 text-slate-body">
              <BarChart3 className="w-12 h-12 text-mist mx-auto mb-3" />
              <p className="font-medium">No results yet</p>
              <p className="text-sm mt-1">Participants' results will appear here as they complete the quiz</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {selectedQuiz.results.map((result, index) => (
                <div key={result.id || index} className="border border-mist rounded-xl p-4 bg-white transition-colors hover:border-brand-blue/30">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h5 className="font-heading font-semibold text-ink">{result.userName}</h5>
                      <div className="text-sm text-slate-body mt-1">
                        Score: {result.score}/{result.total} ({Math.round((result.score / result.total) * 100)}%)
                      </div>
                      <div className="text-xs text-slate-body/70 mt-1">
                        Completed: {formatDate(result.timestamp)}
                        {result.timeTaken && ` • Time: ${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-heading font-bold ${
                        (result.score / result.total) >= 0.7 ? 'text-green-600' : 
                        (result.score / result.total) >= 0.5 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {Math.round((result.score / result.total) * 100)}%
                      </div>
                      <div className="text-xs font-medium text-slate-body mt-1">
                        {result.score}/{result.total} pts
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-mist rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
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
    <div className="card bg-white border border-mist rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-heading font-bold text-ink">Your Quiz History</h3>
        <button
          onClick={onClose}
          className="text-slate-body hover:text-ink transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {quizHistory.length === 0 ? (
        <div className="text-center py-12 text-slate-body border-2 border-dashed border-mist rounded-xl">
          <BookOpen className="w-12 h-12 text-mist mx-auto mb-3" />
          <p className="font-medium">No quiz history yet</p>
          <p className="text-sm mt-1">Your recently created quizzes will appear here</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {quizHistory.map((quiz, index) => (
            <div
              key={quiz.id}
              className="border border-mist rounded-xl p-4 hover:border-brand-blue/30 transition-colors bg-white group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-heading font-semibold text-ink group-hover:text-brand-blue transition-colors">{quiz.title}</h4>
                  <p className="text-sm text-slate-body mt-1">
                    {quiz.passage} • {quiz.questions.length} questions
                  </p>
                  <p className="text-xs text-slate-body/70 mt-2">
                    Created {formatDate(quiz.createdAt)}
                    {quiz.lastUpdated && ` • Updated ${formatDate(quiz.lastUpdated)}`}
                  </p>
                </div>
                <span className="bg-sky-tint-1 text-brand-blue font-medium text-xs px-2.5 py-1 rounded-full">
                  #{index + 1}
                </span>
              </div>
              
              {/* Quiz Stats */}
              <div className="flex items-center justify-between mb-4 border-t border-mist/50 pt-3">
                <div className="flex space-x-4 text-sm text-slate-body font-medium">
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1.5 text-brand-blue" /> {quiz.totalParticipants || 0}</span>
                  <span className="flex items-center"><BarChart3 className="w-4 h-4 mr-1.5 text-brand-violet" /> {quiz.results?.length || 0}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  onClick={() => viewResults(quiz)}
                  className="text-xs px-3 py-1.5 h-auto flex-1 sm:flex-none justify-center"
                  disabled={!quiz.results || quiz.results.length === 0}
                >
                  <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                  <span>Results</span>
                  {quiz.results?.length > 0 && (
                    <span className="ml-1.5 bg-white/20 text-white text-[10px] px-1.5 rounded-full">
                      {quiz.results.length}
                    </span>
                  )}
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => onSelectQuiz(quiz)}
                  className="text-xs px-3 py-1.5 h-auto flex-1 sm:flex-none justify-center"
                >
                  <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                  <span>Use Again</span>
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(quiz.shareLink);
                    alert('Quiz link copied to clipboard!');
                  }}
                  className="text-xs px-3 py-1.5 h-auto flex-1 sm:flex-none justify-center text-slate-body hover:bg-sky-tint-1 hover:text-brand-blue border border-mist"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  <span>Copy Link</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizHistory;