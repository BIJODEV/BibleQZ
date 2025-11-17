import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getQuizFromFirestore, submitQuizResults } from '../../utils/firebaseQuiz';
import Results from './Results';

const QuizTaker = () => {
  const [userName, setUserName] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Add ref to track if submission is in progress
  const isSubmittingRef = useRef(false);
  const hasSubmittedRef = useRef(false);

  const [searchParams] = useSearchParams();
  const quizId = searchParams.get('quizId');

  useEffect(() => {
    if (quizId) {
      loadQuizFromFirestore(quizId);
    } else {
      setError('Invalid quiz link. Please check with the quiz creator.');
    }
  }, [quizId]);

  const loadQuizFromFirestore = async (id) => {
    try {
      const quizData = await getQuizFromFirestore(id);
      if (quizData) {
        const processedQuiz = {
          ...quizData,
          questions: quizData.questions.map(question => ({
            ...question,
            numberOfOptions: question.numberOfOptions || question.options.length
          }))
        };
        
        setQuiz(processedQuiz);
        setAnswers(new Array(processedQuiz.questions.length).fill(null));
        setError('');
      } else {
        setError('Quiz not found. Please check the link.');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      setError('Failed to load quiz. Please try again.');
    }
  };

  const startQuiz = () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    setQuizStarted(true);
    setStartTime(Date.now());
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const submitResults = async () => {
    // Prevent multiple submissions
    if (isSubmittingRef.current || hasSubmittedRef.current) {
      console.log('Submission already in progress or completed');
      return;
    }

    // Set submitting state and ref
    setSubmitting(true);
    isSubmittingRef.current = true;

    try {
      const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : null;
      const score = calculateScore();

      const result = {
        userName: userName.trim(),
        score,
        total: quiz.questions.length,
        timestamp: new Date().toISOString(),
        timeTaken,
        answers: answers.map((answer, index) => {
          const question = quiz.questions[index];
          return {
            question: question.question,
            userAnswer: answer,
            correctAnswer: question.correctAnswer,
            isCorrect: answer === question.correctAnswer,
            options: question.options,
            activeOptions: question.options.slice(0, question.numberOfOptions),
            explanation: question.explanation,
            numberOfOptions: question.numberOfOptions
          }
        })
      };

      // Submit to Firebase
      const success = await submitQuizResults(quizId, result);
      
      if (success) {
        // Mark as submitted to prevent future submissions
        hasSubmittedRef.current = true;
        setShowResults(true);
      } else {
        alert('Failed to submit results. Please try again.');
        // Reset submitting state on failure
        isSubmittingRef.current = false;
      }
    } catch (error) {
      console.error('Error submitting results:', error);
      alert('An error occurred while submitting results. Please try again.');
      // Reset submitting state on error
      isSubmittingRef.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="card bg-red-50 border-red-200">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Invalid Quiz Link</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <a
            href="/"
            className="btn-primary inline-block"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="bg-bible-gold w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-bible-blue">⛪</span>
          </div>
          
          <h1 className="text-3xl font-bold text-bible-blue mb-4">
            {quiz.title}
          </h1>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-bible-blue mb-2">Quiz Details:</h2>
            <p><strong>Bible Passage:</strong> {quiz.passage}</p>
            {quiz.description && (
              <p className="mt-2"><strong>Description:</strong> {quiz.description}</p>
            )}
            <p className="mt-2"><strong>Questions:</strong> {quiz.questions.length}</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Enter Your Name *
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bible-blue focus:border-bible-blue text-lg"
              placeholder="Your full name"
            />
          </div>

          <button
            onClick={startQuiz}
            disabled={!userName.trim()}
            className="btn-primary w-full py-4 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <Results
        quiz={quiz}
        answers={answers}
        userName={userName}
        startTime={startTime}
      />
    );
  }

  const question = quiz.questions[currentQuestion];
  const optionLabels = ['A', 'B', 'C', 'D'];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  // Get only the active options for this question
  const activeOptions = question.options.slice(0, question.numberOfOptions);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-bible-blue h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-bible-blue mb-4">
            {question.question}
          </h2>
          <div className="text-sm text-gray-500 bg-gray-50 inline-block px-3 py-1 rounded-full">
            Bible Passage: {quiz.passage}
          </div>
        </div>

        {/* Options - Only show active options */}
        <div className="space-y-4 mb-8">
          {activeOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                answers[currentQuestion] === index
                  ? 'border-bible-blue bg-blue-50 text-bible-blue'
                  : 'border-gray-200 bg-white hover:border-bible-blue hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold ${
                  answers[currentQuestion] === index
                    ? 'border-bible-blue bg-bible-blue text-white'
                    : 'border-gray-300 bg-white text-gray-600'
                }`}>
                  {optionLabels[index]}
                </div>
                <span className="text-lg">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={answers[currentQuestion] === null || submitting}
            className="btn-primary px-8 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {currentQuestion === quiz.questions.length - 1 
              ? (submitting ? 'Submitting...' : 'Finish Quiz')
              : 'Next →'
            }
          </button>
        </div>
      </div>

      {/* Participant Info */}
      <div className="text-center mt-4 text-gray-500">
        Participant: <strong>{userName}</strong>
      </div>
    </div>
  );
};

export default QuizTaker;