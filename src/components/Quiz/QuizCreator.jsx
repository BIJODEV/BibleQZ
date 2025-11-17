import React, { useState } from 'react';
import { createQuizInFirestore, saveQuizToUserHistory } from '../../utils/firebaseQuiz';
import { useAuth } from '../../contexts/AuthContext';
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
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab('create');
              clearSelectedQuiz();
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-bible-blue text-bible-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📝 Create Quiz
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-bible-blue text-bible-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📊 {selectedQuizFromHistory ? 'Historical Results' : 'Live Results'}
          </button>
        </nav>
      </div>

      {activeTab === 'create' ? (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-bible-blue text-center sm:text-left">
              {selectedQuizFromHistory ? 'Viewing Quiz Results' : 'Create Bible Quiz'}
            </h1>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="btn-secondary px-6 py-3"
            >
              📚 Quiz History
            </button>
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
              <div className="card">
                <h2 className="text-2xl font-bold text-bible-blue mb-6">Quiz Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quiz Title *
                    </label>
                    <input
                      type="text"
                      value={quiz.title}
                      onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bible-blue focus:border-bible-blue"
                      placeholder="e.g., John Meditation Quiz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bible Passage *
                    </label>
                    <input
                      type="text"
                      value={quiz.passage}
                      onChange={(e) => setQuiz(prev => ({ ...prev, passage: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bible-blue focus:border-bible-blue"
                      placeholder="e.g., John 3:1-16"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={quiz.description}
                      onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bible-blue focus:border-bible-blue"
                      rows="3"
                      placeholder="Add any additional context or instructions..."
                    />
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-bible-blue">Questions</h2>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 block">
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
                  className={`w-full mt-6 border-2 border-dashed rounded-lg p-6 transition-colors ${
                    quiz.questions.length >= MAX_QUESTIONS
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-500 hover:text-bible-blue hover:border-bible-blue'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl">+</span>
                    <span className="font-semibold">
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
              <div className="flex space-x-4">
                <button
                  onClick={generateShareLink}
                  disabled={creatingQuiz}
                  className="btn-primary flex-1 py-4 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {creatingQuiz ? 'Creating Quiz...' : 'Generate Share Link'}
                </button>
                
                <button
                  onClick={addQuestion}
                  disabled={quiz.questions.length >= MAX_QUESTIONS}
                  className="btn-secondary py-4 px-8 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add Question
                </button>
              </div>

              {/* Share Link Section */}
              {shareLink && (
                <div className="card bg-green-50 border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">
                    🎉 Quiz Created Successfully!
                  </h3>
                  <p className="text-green-700 mb-4">
                    Share this link with participants. Results will appear in real-time:
                  </p>
                  
                  <div className="flex space-x-2 mb-4">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 p-3 border border-green-300 rounded-lg bg-white text-green-800 font-mono text-sm"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  
                  <div className="text-sm text-green-600 space-y-1">
                    <p>✅ Share via Zoom, Teams, WhatsApp, or email</p>
                    <p>✅ Real-time results automatically appear</p>
                    <p>✅ No action needed from participants after quiz</p>
                    <p>✅ Switch to "Live Results" tab to watch submissions</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-green-200">
                    <button
                      onClick={() => setActiveTab('results')}
                      className="text-green-700 hover:text-green-900 font-semibold underline flex items-center space-x-2"
                    >
                      <span>👀 Watch Live Results</span>
                      <span>→</span>
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
          <div className="card text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-bible-blue mb-4">No Active Quiz</h3>
            <p className="text-gray-600 mb-6">
              Create a quiz first to see live results, or check your Quiz History for previous results.
            </p>
            <button
              onClick={() => setActiveTab('create')}
              className="btn-primary"
            >
              Create a Quiz
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default QuizCreator;