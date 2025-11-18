
import React, { useState } from 'react';
import { bibleQuestions as englishQuestions } from '../../../data/games/BibleQuizData';
import { bibleQuestions as malayalamQuestions } from '../../../data/games/BibleQuizDataMalayalam';

const BibleQuiz = ({ onBack, teamMode, teams, setTeams, currentTeam, setCurrentTeam }) => {
  const [gamePhase, setGamePhase] = useState('language'); // 'language', 'setup', 'playing', 'finished'
  const [language, setLanguage] = useState('english'); // 'english' or 'malayalam'
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

    const questionOptions = [6, 12, 18, 24, 30, 36];

  // Get the appropriate question set based on language
  const getQuestionSet = () => {
    return language === 'malayalam' ? malayalamQuestions : englishQuestions;
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setGamePhase('setup');
  };

  const startQuiz = () => {
    const questions = getQuestionSet();
    // Shuffle and select random questions
    const shuffled = [...questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionCount);
    
    setSelectedQuestions(shuffled);
    setGamePhase('playing');
  };

  const getQuestionTeam = (questionIndex) => {
    return (questionIndex + 1) % 2 === 1 ? 'teamA' : 'teamB';
  };

  const handleAnswer = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
    
    if (optionIndex === selectedQuestions[currentQuestionIndex].correct) {
      if (teamMode) {
        const points = 20;
        const questionTeam = getQuestionTeam(currentQuestionIndex);
        setTeams(prev => ({
          ...prev,
          [questionTeam]: prev[questionTeam] + points
        }));
      } else {
        setScore(score + 1);
      }
    }
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      if (teamMode) {
        const nextQuestionTeam = getQuestionTeam(currentQuestionIndex + 1);
        setCurrentTeam(nextQuestionTeam);
      }
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setGamePhase('language');
    setLanguage('english');
    setQuestionCount(10);
    setSelectedQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (teamMode) {
      setCurrentTeam('teamA');
    }
  };

  const backToLanguage = () => {
    setGamePhase('language');
  };

// Language Selection Phase
if (gamePhase === 'language') {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-md mx-3 sm:mx-auto my-2 sm:my-4">
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🌍</div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">
          Select Language
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600">
          Choose your preferred language for the quiz
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <button
          onClick={() => selectLanguage('english')}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">🇺🇸</div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">English</h2>
          <p className="text-blue-100 text-xs sm:text-sm md:text-base">
            {englishQuestions.length} questions available
          </p>
        </button>

        <button
          onClick={() => selectLanguage('malayalam')}
          className="bg-green-500 hover:bg-green-600 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">🇮🇳</div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">Malayalam</h2>
          <p className="text-green-100 text-xs sm:text-sm md:text-base">
            {malayalamQuestions.length} questions available
          </p>
        </button>
      </div>

      <button
        onClick={onBack}
        className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-colors"
      >
        Back to Menu
      </button>
    </div>
  );
}

// Setup Phase
if (gamePhase === 'setup') {
  const questions = getQuestionSet();

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-md sm:max-w-xl mx-3 sm:mx-auto my-2 sm:my-4">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📝</div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight sm:leading-snug">
          Bible Quiz Setup - {language === 'english' ? 'English' : 'Malayalam'}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600">
          Choose how many questions you want to answer
        </p>
      </div>

      {/* Question Count Selector */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 sm:gap-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center sm:text-left">
            Number of Questions
          </h2>
          <button
            onClick={backToLanguage}
            className="text-blue-500 hover:text-blue-700 font-semibold text-sm sm:text-base flex items-center justify-center sm:justify-start"
          >
            ← <span className="ml-1">Change Language</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6">
          {questionOptions.map((count) => (
            <button
              key={count}
              onClick={() => setQuestionCount(count)}
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-sm sm:text-base transition-all duration-200 ${
                questionCount === count
                  ? 'bg-blue-500 border-blue-500 text-white transform scale-105'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-base sm:text-lg md:text-xl font-bold">{count}</div>
              <div className="text-xs sm:text-sm">questions</div>
            </button>
          ))}
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-6">
          <div className="text-center">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-blue-800">
              Selected: {questionCount} questions in {language === 'english' ? 'English' : 'Malayalam'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Total available: {questions.length} questions
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3 sm:space-y-4">
        <button
          onClick={startQuiz}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 sm:py-3 sm:px-6 rounded-lg font-semibold text-sm sm:text-base transition-colors"
        >
          Start {language === 'english' ? 'English' : 'Malayalam'} Quiz with {questionCount} Questions
        </button>
        <button
          onClick={onBack}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-colors"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}

    // Results Phase
    if (showResult) {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-2xl mx-4 sm:mx-6 md:mx-auto my-4 sm:my-6">
        <div className="text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-4">🎉</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {language === 'english' ? 'English' : 'Malayalam'} Quiz Complete!
            </h2>
            
            {teamMode ? (
            <div className="mb-6">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border-2 border-blue-200">
                    <h3 className="font-bold text-blue-800 text-sm sm:text-base">Team A Score</h3>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    {teams.teamA} points
                    </p>
                </div>
                <div className="bg-red-50 p-3 sm:p-4 rounded-lg border-2 border-red-200">
                    <h3 className="font-bold text-red-800 text-sm sm:text-base">Team B Score</h3>
                    <p className="text-xl sm:text-2xl font-bold text-red-600">
                    {teams.teamB} points
                    </p>
                </div>
                </div>
                <p className="text-base sm:text-lg text-gray-600">
                {teams.teamA === teams.teamB 
                    ? "It's a tie! 🎉" 
                    : teams.teamA > teams.teamB 
                    ? "Team A wins! 🏆" 
                    : "Team B wins! 🏆"
                }
                </p>
            </div>
            ) : (
            <div className="mb-6">
                <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-2">
                You scored <span className="font-bold text-blue-600">{score}</span> out of {selectedQuestions.length}
                </p>
                <p className="text-base sm:text-lg text-gray-600">
                Accuracy: <span className="font-bold text-green-600">
                    {Math.round((score / selectedQuestions.length) * 100)}%
                </span>
                </p>
            </div>
            )}

            <div className="space-y-3 sm:space-y-4">
            <button
                onClick={resetQuiz}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 sm:py-3 sm:px-6 rounded-lg font-semibold transition-colors text-base sm:text-lg"
            >
                Play Again
            </button>
            <button
                onClick={onBack}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 sm:py-3 sm:px-6 rounded-lg font-semibold transition-colors text-base sm:text-lg"
            >
                Back to Menu
            </button>
            </div>
        </div>
        </div>
    );
 }
 
 // Playing Phase
  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const currentQuestionTeam = teamMode ? getQuestionTeam(currentQuestionIndex) : null;

 return (
  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 max-w-2xl mx-3 sm:mx-4 md:mx-auto my-2 sm:my-4">
    <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
      <button 
        onClick={() => setGamePhase('setup')}
        className="bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md w-11 h-11 flex items-center justify-center"
        >
        <span className="text-2xl">←</span>
      </button>
      <div className="text-right">
        <div className="text-xs sm:text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {selectedQuestions.length}
        </div>
        <div className="text-xs text-gray-400">
          {language === 'english' ? 'English' : 'Malayalam'}
        </div>
        {teamMode && currentQuestionTeam && (
          <div className={`text-xs sm:text-sm font-semibold mt-1 ${
            currentQuestionTeam === 'teamA' ? 'text-blue-600' : 'text-red-600'
          }`}>
            {currentQuestionTeam === 'teamA' ? "Team A's Turn" : "Team B's Turn"}
          </div>
        )}
      </div>
    </div>

    {/* Team Indicator Banner */}
    {teamMode && currentQuestionTeam && (
      <div className={`mb-4 p-3 rounded-lg text-center font-bold ${
        currentQuestionTeam === 'teamA' 
          ? 'bg-blue-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        <div className="text-sm sm:text-base">
          {currentQuestionTeam === 'teamA' ? "🎯 TEAM A" : "🎯 TEAM B"}
        </div>
        <div className="text-xs font-normal mt-1">
          Question {currentQuestionIndex + 1} is for {currentQuestionTeam === 'teamA' ? 'Team A' : 'Team B'}
        </div>
      </div>
    )}

    <div className="mb-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">
        {currentQuestion.question}
      </h2>
      
      <div className="space-y-2 sm:space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={selectedAnswer !== null}
            className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base ${
              selectedAnswer === null
                ? teamMode && currentQuestionTeam === 'teamA'
                  ? 'border-blue-200 hover:border-blue-400 hover:bg-blue-50'
                  : teamMode && currentQuestionTeam === 'teamB'
                  ? 'border-red-200 hover:border-red-400 hover:bg-red-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                : selectedAnswer === index
                ? index === currentQuestion.correct
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-red-500 bg-red-50 text-red-700'
                : index === currentQuestion.correct
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 opacity-50'
            }`}
          >
            <div className="flex items-center">
              {option}
              {selectedAnswer !== null && index === currentQuestion.correct && (
                <span className="ml-2 text-green-600">✓</span>
              )}
              {selectedAnswer === index && index !== currentQuestion.correct && (
                <span className="ml-2 text-red-600">✗</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Explanation Section */}
      {showExplanation && (
        <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border-2 ${
          selectedAnswer === currentQuestion.correct 
            ? 'bg-green-50 border-green-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h3 className="font-bold text-base sm:text-lg mb-2">
            {selectedAnswer === currentQuestion.correct 
              ? '✅ Correct!' 
              : '💡 Explanation'}
          </h3>
          <p className="text-gray-700 text-sm sm:text-base">
            {currentQuestion.explanation}
          </p>
          {teamMode && selectedAnswer === currentQuestion.correct && (
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              +20 points for {currentQuestionTeam === 'teamA' ? 'Team A' : 'Team B'}!
            </p>
          )}
          <button
            onClick={nextQuestion}
            className="mt-3 sm:mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            {currentQuestionIndex < selectedQuestions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>

    {!showExplanation && teamMode && (
      <div className="text-center text-xs sm:text-sm text-gray-500">
        Scores: <span className="font-bold text-blue-600">A: {teams.teamA}</span> | 
        <span className="font-bold text-red-600"> B: {teams.teamB}</span>
      </div>
    )}

    {!showExplanation && !teamMode && (
      <div className="text-center text-gray-500 text-sm sm:text-base">
        Score: {score} / {selectedQuestions.length}
      </div>
    )}
  </div>
);
};

export default BibleQuiz;