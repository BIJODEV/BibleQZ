import React, { useState } from 'react';
import { PenLine, BarChart3, History, Plus, CheckCircle2, Copy, Check, Eye } from 'lucide-react';
import { createQuizInFirestore, saveQuizToUserHistory } from '../../utils/firebaseQuiz';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';
import QuestionCard from './QuestionCard';
import QuizResultsDashboard from './QuizResultsDashboard';
import QuizHistory from './QuizHistory';
import QuizCreatorResults from './QuizCreatorResults';

const QuizCreator = () => {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState({
    title: '',
    passage: '',
    description: '',
    questions: [
      {
        id: Date.now(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        numberOfOptions: 4
      }
    ]
  });

  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedQuizFromHistory, setSelectedQuizFromHistory] = useState(null);

  // Question limits
  const MAX_QUESTIONS = 35;
  const WARNING_THRESHOLD = 30;

  const addQuestion = () => {
    if (quiz.questions.length >= MAX_QUESTIONS) {
      alert(`Maximum ${MAX_QUESTIONS} questions allowed per quiz. Consider breaking this into multiple quizzes for better participant engagement.`);
      return;
    }

    if (quiz.questions.length >= WARNING_THRESHOLD) {
      const remaining = MAX_QUESTIONS - quiz.questions.length;
      const shouldContinue = window.confirm(
        `You have ${quiz.questions.length} questions (${remaining} remaining).\n\n` +
        `Long quizzes can be tiring for participants. Are you sure you want to add another question?`
      );
      if (!shouldContinue) return;
    }

    setQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now(),
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: '',
          numberOfOptions: 4
        }
      ]
    }));
  };

  const updateQuestion = (questionId, updates) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const removeQuestion = (questionId) => {
    if (quiz.questions.length > 1) {
      setQuiz(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q.id !== questionId)
      }));
    }
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              )
            }
          : q
      )
    }));
  };

  const updateNumberOfOptions = (questionId, newNumberOfOptions) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          const currentOptions = [...q.options];

          let newOptions;
          if (newNumberOfOptions > currentOptions.length) {
            newOptions = [...currentOptions, ...Array(newNumberOfOptions - currentOptions.length).fill('')];
          } else {
            newOptions = currentOptions.slice(0, newNumberOfOptions);
          }

          let newCorrectAnswer = q.correctAnswer;
          if (q.correctAnswer >= newNumberOfOptions) {
            newCorrectAnswer = newNumberOfOptions - 1;
          }

          return {
            ...q,
            numberOfOptions: newNumberOfOptions,
            options: newOptions,
            correctAnswer: newCorrectAnswer
          };
        }
        return q;
      })
    }));
  };

  const validateQuiz = () => {
    if (!quiz.title.trim()) {
      alert('Please enter a quiz title');
      return false;
    }

    if (!quiz.passage.trim()) {
      alert('Please enter a Bible passage');
      return false;
    }

    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      if (!q.question.trim()) {
        alert(`Please enter question ${i + 1}`);
        return false;
      }

      for (let j = 0; j < q.numberOfOptions; j++) {
        if (!q.options[j].trim()) {
          alert(`Please enter all options for question ${i + 1}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSelectQuizFromHistory = (quizFromHistory) => {
    setQuiz({
      title: `${quizFromHistory.title} (Copy)`,
      passage: quizFromHistory.passage,
      description: quizFromHistory.description || '',
      questions: quizFromHistory.questions.map(q => ({
        ...q,
        id: Date.now() + Math.random(),
        numberOfOptions: q.numberOfOptions || q.options.length
      }))
    });
    setShowHistory(false);
  };

  const handleViewResultsFromHistory = (quizFromHistory) => {
    setSelectedQuizFromHistory(quizFromHistory);
    setActiveTab('results');
    setShowHistory(false);
  };

  const generateShareLink = async () => {
    if (!validateQuiz()) return;

    setCreatingQuiz(true);

    if (!quiz.id) {
      quiz.id = 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    const quizData = {
      ...quiz,
      createdAt: new Date().toISOString(),
      version: '1.0'
    };

    const success = await createQuizInFirestore(quizData);

    if (success && user) {
      await saveQuizToUserHistory(user.uid, {
        id: quizData.id,
        title: quizData.title,
        passage: quizData.passage,
        description: quizData.description,
        questions: quizData.questions,
        createdAt: quizData.createdAt,
        shareLink: `${window.location.origin}/quiz?quizId=${quizData.id}`
      });

      const link = `${window.location.origin}/quiz?quizId=${quizData.id}`;
      setShareLink(link);
      setQuiz(quizData);
    } else if (success) {
      const link = `${window.location.origin}/quiz?quizId=${quizData.id}`;
      setShareLink(link);
      setQuiz(quizData);
    } else {
      alert('Failed to create quiz. Please try again.');
    }

    setCreatingQuiz(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearSelectedQuiz = () => {
    setSelectedQuizFromHistory(null);
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="border-b border-mist">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab('create');
              clearSelectedQuiz();
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
              activeTab === 'create'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-body hover:text-ink hover:border-mist'
            }`}
          >
            <PenLine className="w-4 h-4" />
            <span>Create Quiz</span>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
              activeTab === 'results'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-body hover:text-ink hover:border-mist'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{selectedQuizFromHistory ? 'Historical Results' : 'Live Results'}</span>
          </button>
        </nav>
      </div>

      {activeTab === 'create' ? (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink text-center sm:text-left">
              {selectedQuizFromHistory ? 'Viewing Quiz Results' : 'Create Bible Quiz'}
            </h1>
            <Button
              variant="secondary"
              onClick={() => setShowHistory(!showHistory)}
              className="px-6 py-2"
            >
              <History className="w-4 h-4 mr-2" />
              <span>Quiz History</span>
            </Button>
          </div>

          {/* Show History or Create Form */}
          {showHistory ? (
            <QuizHistory 
              onSelectQuiz={handleSelectQuizFromHistory}
              onViewResults={handleViewResultsFromHistory}
              onClose={() => setShowHistory(false)}
            />
          ) : (
            <>
              {/* Quiz Basic Info */}
              <div className="card border border-mist rounded-2xl p-6 shadow-sm bg-white">
                <h2 className="text-xl font-heading font-bold text-ink mb-6">Quiz Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      Quiz Title *
                    </label>
                    <input
                      type="text"
                      value={quiz.title}
                      onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-mist rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-slate-body outline-none transition-all"
                      placeholder="e.g., John Meditation Quiz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      Bible Passage *
                    </label>
                    <input
                      type="text"
                      value={quiz.passage}
                      onChange={(e) => setQuiz(prev => ({ ...prev, passage: e.target.value }))}
                      className="w-full p-3 border border-mist rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-slate-body outline-none transition-all"
                      placeholder="e.g., John 3:1-16"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={quiz.description}
                      onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 border border-mist rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-slate-body outline-none transition-all"
                      rows="3"
                      placeholder="Add any additional context or instructions..."
                    />
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="card border border-mist rounded-2xl p-6 shadow-sm bg-white">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-heading font-bold text-ink">Questions</h2>
                  <div className="text-right">
                    <span className="text-sm text-slate-body block">
                      {quiz.questions.length} of {MAX_QUESTIONS} questions
                    </span>
                    {quiz.questions.length >= WARNING_THRESHOLD && (
                      <span className="text-xs text-orange-500 font-medium">
                        • Quiz is getting long
                      </span>
                    )}
                    {quiz.questions.length >= MAX_QUESTIONS && (
                      <span className="text-xs text-red-500 font-medium">
                        • Maximum reached
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  {quiz.questions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      onUpdate={(updates) => updateQuestion(question.id, updates)}
                      onRemove={() => removeQuestion(question.id)}
                      onOptionUpdate={(optionIndex, value) => updateOption(question.id, optionIndex, value)}
                      onNumberOfOptionsChange={(newNumber) => updateNumberOfOptions(question.id, newNumber)}
                    />
                  ))}
                </div>

                <button
                  onClick={addQuestion}
                  disabled={quiz.questions.length >= MAX_QUESTIONS}
                  className={`w-full mt-6 border-2 border-dashed rounded-xl p-6 transition-colors ${
                    quiz.questions.length >= MAX_QUESTIONS
                      ? 'border-mist bg-gray-50 text-slate-body/50 cursor-not-allowed'
                      : 'border-mist text-slate-body hover:text-brand-blue hover:border-brand-blue hover:bg-sky-tint-1/30'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Plus className="w-6 h-6" />
                    <span className="font-heading font-semibold">
                      {quiz.questions.length >= MAX_QUESTIONS 
                        ? 'Maximum Questions Reached' 
                        : 'Add Another Question'
                      }
                    </span>
                  </div>
                  {quiz.questions.length >= WARNING_THRESHOLD && quiz.questions.length < MAX_QUESTIONS && (
                    <p className="text-xs text-orange-500 mt-2">
                      {MAX_QUESTIONS - quiz.questions.length} questions remaining
                    </p>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="primary"
                  onClick={generateShareLink}
                  disabled={creatingQuiz}
                  className="flex-1 py-4 text-lg"
                >
                  {creatingQuiz ? 'Creating Quiz...' : 'Generate Share Link'}
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={addQuestion}
                  disabled={quiz.questions.length >= MAX_QUESTIONS}
                  className="py-4 px-8 text-lg"
                >
                  Add Question
                </Button>
              </div>

              {/* Share Link Section */}
              {shareLink && (
                <div className="card bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-heading font-semibold text-green-800">
                      Quiz Created Successfully!
                    </h3>
                  </div>
                  <p className="text-green-700 mb-4 text-sm md:text-base">
                    Share this link with participants. Results will appear in real-time:
                  </p>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 p-3 border border-green-300 rounded-lg bg-white text-green-800 font-mono text-sm outline-none"
                    />
                    <Button
                      variant="primary"
                      onClick={copyToClipboard}
                      className="!bg-green-600 hover:!bg-green-700 border-transparent w-full sm:w-auto"
                    >
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </Button>
                  </div>
                  
                  <div className="text-sm text-green-700 space-y-2">
                    <p className="flex items-center space-x-2"><Check className="w-4 h-4" /> <span>Share via Zoom, Teams, WhatsApp, or email</span></p>
                    <p className="flex items-center space-x-2"><Check className="w-4 h-4" /> <span>Real-time results automatically appear</span></p>
                    <p className="flex items-center space-x-2"><Check className="w-4 h-4" /> <span>No action needed from participants after quiz</span></p>
                    <p className="flex items-center space-x-2"><Check className="w-4 h-4" /> <span>Switch to "Live Results" tab to watch submissions</span></p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-green-200">
                    <button
                      onClick={() => setActiveTab('results')}
                      className="text-green-700 hover:text-green-900 font-semibold flex items-center space-x-2 group transition-colors"
                    >
                      <Eye className="w-4 h-4 group-hover:text-green-900" />
                      <span>Watch Live Results</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        /* Results Dashboard - Either Live or Historical */
        selectedQuizFromHistory ? (
          <QuizCreatorResults 
            quizId={selectedQuizFromHistory.id} 
            quizTitle={selectedQuizFromHistory.title}
            onBack={clearSelectedQuiz}
          />
        ) : quiz.id ? (
          <QuizResultsDashboard 
            quizId={quiz.id} 
            quizTitle={quiz.title} 
            isFirebase={true}
          />
        ) : (
          <div className="card text-center rounded-2xl border border-mist p-12 bg-white">
            <div className="flex justify-center mb-6">
              <BarChart3 className="w-16 h-16 text-mist" />
            </div>
            <h3 className="text-xl font-heading font-bold text-ink mb-4">No Active Quiz</h3>
            <p className="text-slate-body mb-8 max-w-md mx-auto">
              Create a quiz first to see live results, or check your Quiz History for previous results.
            </p>
            <Button
              variant="primary"
              onClick={() => setActiveTab('create')}
            >
              <PenLine className="w-4 h-4 mr-2" />
              Create a Quiz
            </Button>
          </div>
        )
      )}
    </div>
  );
};

export default QuizCreator;