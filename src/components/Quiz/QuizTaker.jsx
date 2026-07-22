import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, BookOpen, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { getQuizFromFirestore, submitQuizResults } from '../../utils/firebaseQuiz';
import Results from './Results';
import Button from '../UI/Button';

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
    if (isSubmittingRef.current || hasSubmittedRef.current) return;

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

      const success = await submitQuizResults(quizId, result);
      
      if (success) {
        hasSubmittedRef.current = true;
        setShowResults(true);
      } else {
        alert('Failed to submit results. Please try again.');
        isSubmittingRef.current = false;
      }
    } catch (error) {
      console.error('Error submitting results:', error);
      alert('An error occurred while submitting results. Please try again.');
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
        <div className="bg-red-50 border border-red-200 p-8 rounded-2xl shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-red-800 mb-4">Invalid Quiz Link</h2>
          <p className="text-red-600 mb-8">{error}</p>
          <a href="/">
            <Button variant="primary">Return to Home</Button>
          </a>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded-lg w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-mist rounded-2xl shadow-sm p-8 text-center">
          <div className="bg-brand-blue/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-brand-blue" />
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-ink mb-6">
            {quiz.title}
          </h1>
          
          <div className="bg-slate-50 border border-mist rounded-2xl p-6 mb-8 text-left">
            <h2 className="font-heading font-semibold text-ink mb-3">Quiz Details:</h2>
            <div className="space-y-2 text-slate-body">
              <p><strong className="text-ink font-medium">Bible Passage:</strong> {quiz.passage}</p>
              {quiz.description && (
                <p><strong className="text-ink font-medium">Description:</strong> {quiz.description}</p>
              )}
              <p><strong className="text-ink font-medium">Questions:</strong> {quiz.questions.length}</p>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-ink mb-2 text-left">
              Enter Your Name *
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-4 border border-mist rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-lg outline-none transition-shadow"
              placeholder="Your full name"
            />
          </div>

          <Button
            variant="primary"
            onClick={startQuiz}
            disabled={!userName.trim()}
            className="w-full py-4 text-lg"
          >
            Start Quiz
          </Button>
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
  const activeOptions = question.options.slice(0, question.numberOfOptions);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-body font-medium mb-2">
          <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-brand-blue h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="bg-white border border-mist rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-ink mb-4 leading-tight">
            {question.question}
          </h2>
          <div className="text-sm font-medium text-slate-body bg-slate-50 border border-mist inline-flex px-4 py-1.5 rounded-full">
            Bible Passage: {quiz.passage}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-10">
          {activeOptions.map((option, index) => {
            const isSelected = answers[currentQuestion] === index;
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 sm:p-5 text-left rounded-xl border-2 transition-all duration-200 flex items-center space-x-4 outline-none ${
                  isSelected
                    ? 'border-brand-blue bg-brand-blue/5 text-brand-blue shadow-sm'
                    : 'border-mist bg-white hover:border-brand-blue/40 hover:bg-slate-50 text-ink'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-heading font-semibold transition-colors ${
                  isSelected
                    ? 'border-brand-blue bg-brand-blue text-white'
                    : 'border-mist bg-white text-slate-body'
                }`}>
                  {optionLabels[index]}
                </div>
                <span className={`text-base sm:text-lg ${isSelected ? 'font-medium' : ''}`}>{option}</span>
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-mist">
          <Button
            variant="secondary"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>
          
          <Button
            variant="primary"
            onClick={nextQuestion}
            disabled={answers[currentQuestion] === null || submitting}
            className="flex items-center gap-2 px-8"
          >
            {currentQuestion === quiz.questions.length - 1 
              ? (submitting ? 'Submitting...' : <>Finish Quiz <Check className="w-4 h-4" /></>)
              : <>Next <ArrowRight className="w-4 h-4" /></>
            }
          </Button>
        </div>
      </div>

      {/* Participant Info */}
      <div className="text-center mt-6 text-sm text-slate-body">
        Participant: <strong className="text-ink font-medium">{userName}</strong>
      </div>
    </div>
  );
};

export default QuizTaker;