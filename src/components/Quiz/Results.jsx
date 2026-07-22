import React, { useState, useEffect } from 'react';
import { Trophy, Award, ThumbsUp, Star, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';
import { encodeResultsForSharing } from '../../utils/quizEncoder';
import Button from '../components/Button';

const Results = ({ quiz, answers, userName, startTime }) => {
  const [score, setScore] = useState(0);
  const [resultsLink, setResultsLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Calculate score
  useEffect(() => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
  }, [quiz, answers]);

  // Generate results link
  useEffect(() => {
    const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : null;
    
    const result = {
      userName,
      score,
      total: quiz.questions.length,
      quizTitle: quiz.title,
      passage: quiz.passage,
      timestamp: new Date().toISOString(),
      timeTaken,
      answers: answers.map((answer, index) => ({
        question: quiz.questions[index].question,
        userAnswer: answer,
        correctAnswer: quiz.questions[index].correctAnswer,
        isCorrect: answer === quiz.questions[index].correctAnswer,
        options: quiz.questions[index].options,
        explanation: quiz.questions[index].explanation
      }))
    };

    const encodedResults = encodeResultsForSharing(quiz.id, result);
    if (encodedResults) {
      setResultsLink(`${window.location.origin}/import-results#${encodedResults}`);
    }
  }, [quiz, answers, userName, startTime, score]);

  const percentage = (score / quiz.questions.length) * 100;
  
  let FeedbackIcon = Star;
  let message = '';
  let iconColor = 'text-brand-blue';

  if (percentage >= 90) {
    message = 'Excellent! You have great knowledge of this passage!';
    FeedbackIcon = Trophy;
    iconColor = 'text-amber-500';
  } else if (percentage >= 70) {
    message = 'Great job! You understand this passage well.';
    FeedbackIcon = Award;
    iconColor = 'text-brand-blue';
  } else if (percentage >= 50) {
    message = 'Good effort! Keep meditating on God\'s Word.';
    FeedbackIcon = ThumbsUp;
    iconColor = 'text-green-600';
  } else {
    message = 'Keep studying! The Word of God is rich and deep.';
    FeedbackIcon = Star;
    iconColor = 'text-slate-400';
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Overview Card */}
      <div className="bg-white border border-mist rounded-2xl shadow-sm p-8 text-center">
        <FeedbackIcon className={`w-16 h-16 mx-auto mb-6 ${iconColor}`} />
        <h1 className="text-4xl font-heading font-bold text-ink mb-6">Quiz Completed!</h1>
        
        <div className="bg-gradient-to-r from-brand-blue to-indigo-600 inline-block p-1 rounded-full mb-8 shadow-sm">
          <div className="bg-white rounded-full p-8 px-12">
            <div className="text-5xl font-heading font-bold text-brand-blue mb-2">
              {score}/{quiz.questions.length}
            </div>
            <div className="text-2xl font-heading font-semibold text-slate-body">
              {percentage.toFixed(0)}%
            </div>
          </div>
        </div>

        <p className="text-xl text-slate-body mb-3">
          Great job, <strong className="text-ink">{userName}</strong>!
        </p>
        <p className="text-lg text-brand-blue font-heading font-semibold mb-10">
          {message}
        </p>

        {/* Results Summary */}
        <div className="bg-slate-50 border border-mist rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-heading font-semibold text-ink mb-4">Quiz Summary:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-body">
            <div><strong className="text-ink font-medium">Quiz:</strong> {quiz.title}</div>
            <div><strong className="text-ink font-medium">Passage:</strong> {quiz.passage}</div>
            <div><strong className="text-ink font-medium">Your Score:</strong> {score} out of {quiz.questions.length}</div>
            <div><strong className="text-ink font-medium">Percentage:</strong> {percentage.toFixed(1)}%</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-8 py-3"
          >
            <RotateCcw className="w-4 h-4" /> Retake Quiz
          </Button>
          <a href="/" className="block">
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2 px-8 py-3"
            >
              <Home className="w-4 h-4" /> Back to Home
            </Button>
          </a>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white border border-mist rounded-2xl shadow-sm p-6 sm:p-8">
        <h3 className="text-2xl font-heading font-bold text-ink mb-8 border-b border-mist pb-4">Detailed Results</h3>
        
        <div className="space-y-6">
          {quiz.questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div
                key={index}
                className={`border rounded-2xl p-6 transition-colors ${
                  isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
                }`}
              >
                <div className="flex items-start space-x-4 mb-5">
                  <div className="mt-1 flex-shrink-0">
                    {isCorrect 
                      ? <CheckCircle className="w-7 h-7 text-green-500" />
                      : <XCircle className="w-7 h-7 text-red-500" />
                    }
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-lg text-ink leading-tight">
                      Question {index + 1}: {question.question}
                    </h4>
                  </div>
                </div>

                <div className="ml-11 space-y-3">
                  {question.options.map((option, optIndex) => {
                    let optionClass = 'text-slate-body';
                    if (optIndex === question.correctAnswer) {
                      optionClass = 'text-green-700 font-medium bg-green-100/50 px-3 py-1.5 rounded-lg inline-block w-full';
                    } else if (optIndex === userAnswer && !isCorrect) {
                      optionClass = 'text-red-700 font-medium bg-red-100/50 px-3 py-1.5 rounded-lg inline-block w-full line-through decoration-red-300';
                    } else {
                      optionClass += ' px-3 py-1.5 inline-block w-full';
                    }
                    
                    return (
                      <div key={optIndex} className={optionClass}>
                        <span className="font-semibold mr-2 opacity-75">
                          {['A', 'B', 'C', 'D'][optIndex]}.
                        </span>
                        {option}
                        {optIndex === question.correctAnswer && <span className="ml-2 text-green-600 font-semibold text-sm tracking-wide">(Correct)</span>}
                        {optIndex === userAnswer && !isCorrect && <span className="ml-2 text-red-500 font-semibold text-sm tracking-wide">(Your answer)</span>}
                      </div>
                    );
                  })}
                  
                  {question.explanation && (
                    <div className="mt-4 p-4 bg-white border border-mist rounded-xl text-slate-body text-sm leading-relaxed shadow-sm">
                      <strong className="text-ink font-heading mb-1 block flex items-center gap-2">
                         <BookOpen className="w-4 h-4 text-brand-blue" /> Explanation:
                      </strong> 
                      {question.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Results;