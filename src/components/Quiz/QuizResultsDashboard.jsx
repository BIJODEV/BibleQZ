import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, Download, Trash2, BarChart2 } from 'lucide-react';
import { listenToQuizResults } from '../../utils/firebaseQuiz';
import { getStoredQuizResults, clearQuizResults } from '../../utils/quizEncoder'; 
import Button from '../UI/Button';

const QuizResultsDashboard = ({ quizId, quizTitle, isFirebase = false }) => {
  const [results, setResults] = useState([]);
  const [showExport, setShowExport] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizId) return;

    if (isFirebase) {
      console.log('Setting up Firebase listener for quiz:', quizId);
      const unsubscribe = listenToQuizResults(quizId, (firebaseResults) => {
        console.log('Firebase results received:', firebaseResults);
        setResults(firebaseResults || []);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      loadResults();
      const interval = setInterval(loadResults, 10000);
      return () => clearInterval(interval);
    }
  }, [quizId, isFirebase]);

  const loadResults = () => {
    const storedResults = getStoredQuizResults(quizId);
    setResults(storedResults);
    setLoading(false);
  };

  const clearResults = async () => {
    if (window.confirm('Are you sure you want to clear all results? This cannot be undone.')) {
      if (isFirebase) {
        alert('To clear Firebase results, you need to delete them manually from the Firebase console for now.');
      } else {
        clearQuizResults(quizId);
        setResults([]);
      }
    }
  };
  
  const exportToCSV = () => {
    if (results.length === 0) return;
    const headers = ['Name', 'Score', 'Total', 'Percentage', 'Date', 'Time Taken'];
    const csvContent = [
      headers.join(','),
      ...results.map(result => [
        `"${result.userName.replace('"', '""')}"`,
        result.score,
        result.total,
        ((result.score / result.total) * 100).toFixed(1) + '%',
        new Date(result.timestamp).toLocaleDateString(),
        result.timeTaken ? `${result.timeTaken}s` : 'N/A'
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
    const dataStr = JSON.stringify(results, null, 2);
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
    if (results.length === 0) return 0;
    const total = results.reduce((sum, result) => sum + result.score, 0);
    return (total / results.length).toFixed(1);
  };

  const getScoreDistribution = () => {
    const distribution = { excellent: 0, good: 0, average: 0, poor: 0 };
    results.forEach(result => {
      const percentage = (result.score / result.total) * 100;
      if (percentage >= 90) distribution.excellent++;
      else if (percentage >= 70) distribution.good++;
      else if (percentage >= 50) distribution.average++;
      else distribution.poor++;
    });
    return distribution;
  };

  const distribution = getScoreDistribution();

  return (
    <div className="card bg-white shadow-sm rounded-2xl w-full max-w-6xl mx-auto p-4 sm:p-6 border border-mist">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-ink flex items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
          {isFirebase ? <Activity className="w-6 h-6 text-brand-blue" /> : <BarChart2 className="w-6 h-6 text-brand-blue" />}
          {isFirebase ? 'Live Results Dashboard' : 'Quiz Results Dashboard'}
        </h2>

        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <Button
            variant="secondary"
            onClick={isFirebase ? () => window.location.reload() : loadResults}
            className="text-sm sm:text-base flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowExport(!showExport)}
            className="text-sm sm:text-base flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button
            variant="danger" // Assuming your Button component supports a danger variant
            onClick={clearResults}
            className="text-sm sm:text-base flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </Button>
        </div>
      </div>

      {/* Live Indicator */}
      {isFirebase && (
        <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-xl p-3 sm:p-4 mb-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <Activity className="w-5 h-5 text-brand-blue mb-1 sm:mb-0 animate-pulse" />
            <span className="font-heading font-semibold text-brand-blue">Live Updates Active</span>
          </div>
          <p className="text-brand-blue/80 text-sm mt-1">
            Results will appear automatically as participants submit their quizzes.
            {loading && ' (Connecting...)'}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-brand-blue/5 border border-mist p-4 rounded-2xl text-center shadow-sm">
          <div className="text-xl sm:text-3xl font-heading font-bold text-brand-blue">{results.length}</div>
          <div className="text-xs sm:text-sm text-slate-body font-medium mt-1">Participants</div>
        </div>
        <div className="bg-green-50 border border-green-100 p-4 rounded-2xl text-center shadow-sm">
          <div className="text-xl sm:text-3xl font-heading font-bold text-green-600">{getAverageScore()}</div>
          <div className="text-xs sm:text-sm text-green-700 font-medium mt-1">Average Score</div>
        </div>
        <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl text-center shadow-sm">
          <div className="text-xl sm:text-3xl font-heading font-bold text-purple-600">{distribution.excellent}</div>
          <div className="text-xs sm:text-sm text-purple-700 font-medium mt-1">Excellent (90%+)</div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-center shadow-sm">
          <div className="text-xl sm:text-3xl font-heading font-bold text-amber-600">{distribution.poor}</div>
          <div className="text-xs sm:text-sm text-amber-700 font-medium mt-1">Needs Help (&lt;50%)</div>
        </div>
      </div>

      {/* Export Options */}
      {showExport && (
        <div className="bg-slate-50 border border-mist p-4 rounded-2xl mb-6 shadow-sm">
          <h3 className="font-heading font-semibold text-ink mb-3">Export Results</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              onClick={exportToCSV}
              disabled={results.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Export as CSV
            </Button>
            <Button
              variant="secondary"
              onClick={exportToJSON}
              disabled={results.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Export as JSON
            </Button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && isFirebase && (
        <div className="text-center py-12">
          <RefreshCw className="animate-spin w-10 h-10 text-brand-blue mx-auto mb-4" />
          <p className="text-slate-body text-sm sm:text-base">Connecting to live results...</p>
        </div>
      )}

      {/* Results Table */}
      {!loading && results.length > 0 ? (
        <div className="overflow-hidden border border-mist rounded-2xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead>
                <tr className="bg-slate-50 border-b border-mist">
                  <th className="p-3 sm:p-4 text-left font-heading font-medium text-ink">Name</th>
                  <th className="p-3 sm:p-4 text-center font-heading font-medium text-ink">Score</th>
                  <th className="p-3 sm:p-4 text-center font-heading font-medium text-ink">%</th>
                  <th className="p-3 sm:p-4 text-center font-heading font-medium text-ink">Date</th>
                  <th className="p-3 sm:p-4 text-center font-heading font-medium text-ink">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist">
                {results.map((r, i) => {
                  const pct = (r.score / r.total) * 100;
                  let color = pct >= 90 ? 'text-green-600' : pct >= 70 ? 'text-brand-blue' : pct >= 50 ? 'text-amber-600' : 'text-red-600';
                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 sm:p-4 font-medium text-ink">{r.userName}</td>
                      <td className={`p-3 sm:p-4 text-center font-semibold ${color}`}>{r.score}/{r.total}</td>
                      <td className={`p-3 sm:p-4 text-center font-semibold ${color}`}>{pct.toFixed(1)}%</td>
                      <td className="p-3 sm:p-4 text-center text-slate-body text-xs sm:text-sm">{new Date(r.timestamp).toLocaleDateString()}</td>
                      <td className="p-3 sm:p-4 text-center text-slate-body text-xs sm:text-sm">{r.timeTaken ? `${r.timeTaken}s` : 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : !loading && (
        <div className="text-center py-12 text-slate-body px-2 border border-mist border-dashed rounded-2xl">
          <BarChart2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-base sm:text-lg font-heading font-medium text-ink">
            {isFirebase ? 'Waiting for participants...' : 'No results yet.'}
          </p>
          <p className="text-sm mt-2 text-slate-body">
            {isFirebase 
              ? 'Share the quiz link. Results will appear here automatically.'
              : 'Share the quiz link and import their results.'
            }
          </p>
        </div>
      )}

      {/* Auto-refresh info */}
      {!isFirebase && !loading && (
        <p className="flex items-center justify-center gap-2 mt-6 text-xs sm:text-sm text-slate-body">
          <RefreshCw className="w-3 h-3" /> Auto-refreshing every 10 seconds
        </p>
      )}
    </div>
  );
};

export default QuizResultsDashboard;