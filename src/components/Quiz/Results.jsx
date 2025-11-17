import React, { useState, useEffect } from 'react';
import { encodeResultsForSharing } from '../../utils/quizEncoder';

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resultsLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const percentage = (score / quiz.questions.length) * 100;
  let message = '';
  let emoji = '';

  if (percentage >= 90) {
    message = 'Excellent! You have great knowledge of this passage!';
    emoji = '🎉';
  } else if (percentage >= 70) {
    message = 'Great job! You understand this passage well.';
    emoji = '👍';
  } else if (percentage >= 50) {
    message = 'Good effort! Keep meditating on God\'s Word.';
    emoji = '🙏';
  } else {
    message = 'Keep studying! The Word of God is rich and deep.';
    emoji = '💪';
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card text-center">
        <div className="text-6xl mb-4">{emoji}</div>
        <h1 className="text-4xl font-bold text-bible-blue mb-4">Quiz Completed!</h1>
        
        <div className="bg-gradient-to-r from-bible-blue to-bible-purple inline-block p-1 rounded-full mb-6">
          <div className="bg-white rounded-full p-8">
            <div className="text-5xl font-bold text-bible-blue mb-2">
              {score}/{quiz.questions.length}
            </div>
            <div className="text-2xl font-semibold text-bible-gold">
              {percentage.toFixed(0)}%
            </div>
          </div>
        </div>

        <p className="text-xl text-gray-600 mb-2">
          Great job, <strong>{userName}</strong>!
        </p>
        <p className="text-lg text-bible-blue font-semibold mb-8">
          {message}
        </p>

        {/* Share Results */}
        {/* <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            📤 Share Your Results
          </h3>
          <p className="text-blue-700 mb-4">
            Copy this link and send it to your quiz creator:
          </p>
          
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={resultsLink}
              readOnly
              className="flex-1 p-3 border border-blue-300 rounded-lg bg-white text-blue-800 font-mono text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          <div className="text-sm text-blue-600 space-y-1">
            <p>📧 Send this link via email, WhatsApp, or any messaging app</p>
            <p>👨‍🏫 The quiz creator will import your results into their dashboard</p>
            <p>✅ Your score: <strong>{score}/{quiz.questions.length} ({percentage.toFixed(1)}%)</strong></p>
          </div>
        </div> */}

        {/* Results Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-bible-blue mb-4">Quiz Summary:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><strong>Quiz:</strong> {quiz.title}</div>
            <div><strong>Passage:</strong> {quiz.passage}</div>
            <div><strong>Your Score:</strong> {score} out of {quiz.questions.length}</div>
            <div><strong>Percentage:</strong> {percentage.toFixed(1)}%</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary px-8 py-3"
          >
            Retake Quiz
          </button>
          <a
            href="/"
            className="px-8 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="card mt-8">
        <h3 className="text-2xl font-bold text-bible-blue mb-6">Detailed Results</h3>
        
        <div className="space-y-6">
          {quiz.questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div
                key={index}
                className={`border-2 rounded-lg p-6 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start space-x-3 mb-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">
                      Question {index + 1}: {question.question}
                    </h4>
                  </div>
                </div>

                <div className="ml-11 space-y-2">
                  {question.options.map((option, optIndex) => {
                    let optionClass = 'text-gray-700';
                    if (optIndex === question.correctAnswer) {
                      optionClass = 'text-green-700 font-semibold';
                    } else if (optIndex === userAnswer && !isCorrect) {
                      optionClass = 'text-red-700 font-semibold';
                    }
                    
                    return (
                      <div key={optIndex} className={optionClass}>
                        <span className="font-semibold">
                          {['A', 'B', 'C', 'D'][optIndex]}.
                        </span>{' '}
                        {option}
                        {optIndex === question.correctAnswer && ' ✓'}
                        {optIndex === userAnswer && !isCorrect && ' ✗ (Your answer)'}
                      </div>
                    );
                  })}
                  
                  {question.explanation && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <strong>Explanation:</strong> {question.explanation}
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