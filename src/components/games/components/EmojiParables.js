import React, { useState, useEffect } from 'react';
import { emojiParables } from '../../../data/games/emojiParablesData';

const EmojiParables = ({ onBack, teamMode, teams, setTeams, currentTeam, setCurrentTeam }) => {
  const [gamePhase, setGamePhase] = useState('language');
  const [language, setLanguage] = useState('english');
  const [currentParable, setCurrentParable] = useState(null);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [usedParables, setUsedParables] = useState([]);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(8);
  const [timer, setTimer] = useState(45);
  const [showCorrect, setShowCorrect] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [currentClueIndex, setCurrentClueIndex] = useState(0);

  const getParableSet = () => {
    return emojiParables[language] || emojiParables.english;
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    startNewRound();
    setGamePhase('playing');
  };

  const startNewRound = () => {
    const parables = getParableSet();
    const availableParables = parables.filter(p => !usedParables.includes(p.id));
    
    if (availableParables.length === 0 || round > totalRounds) {
      setGameOver(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableParables.length);
    const newParable = availableParables[randomIndex];
    
    setCurrentParable(newParable);
    setGuess('');
    setShowAnswer(false);
    setShowCorrect(false);
    setTimer(45);
    setCurrentClueIndex(0);
    setUsedParables(prev => [...prev, newParable.id]);
  };

    const checkAnswer = () => {
    if (!currentParable) return;

    const userAnswer = guess.trim().toLowerCase();
    const correctAnswer = currentParable.answer.toLowerCase();

    // Tokenize both answers into words (ignore small connector words)
    const clean = (text) =>
        text
        .replace(/[^a-z0-9\s]/gi, '') // remove punctuation
        .split(/\s+/)
        .filter(
            (w) =>
            w.length > 2 && !['the', 'and', 'of', 'in', 'on', 'to', 'a'].includes(w)
        );

    const userWords = clean(userAnswer);
    const correctWords = clean(correctAnswer);

    // Count overlap of words
    const matches = userWords.filter((w) => correctWords.includes(w)).length;
    const matchRatio = matches / correctWords.length;

    // Accept if:
    // - user types exact answer
    // - user types at least 1–2 meaningful words from it (match ratio ≥ 0.4)
    const isCorrect =
        userAnswer === correctAnswer ||
        userAnswer.includes(correctAnswer) ||
        correctAnswer.includes(userAnswer) ||
        matchRatio >= 0.4;

    if (isCorrect) {
        const basePoints = 50;
        const timeBonus = Math.max(0, timer * 1.5);
        const cluePenalty = currentClueIndex * 10;
        const points = basePoints + timeBonus - cluePenalty;

        setPointsEarned(points);
        setShowCorrect(true);

        setTimeout(() => {
        if (teamMode) {
            setTeams((prev) => ({
            ...prev,
            [currentTeam]: prev[currentTeam] + Math.round(points),
            }));
            setCurrentTeam(currentTeam === 'teamA' ? 'teamB' : 'teamA');
        } else {
            setScore((prev) => prev + Math.round(points));
        }

        if (round < totalRounds) {
            setRound((prev) => prev + 1);
            startNewRound();
        } else {
            setGameOver(true);
        }
        }, 2500);
    } else {
        alert('Not quite! Try again or ask for a clue.');
        setGuess('');
    }
    };


  const nextClue = () => {
    if (currentParable && currentClueIndex < currentParable.clues.length - 1) {
      setCurrentClueIndex(prev => prev + 1);
    }
  };

  const revealAnswer = () => {
    setShowAnswer(true);
    setTimeout(() => {
      if (round < totalRounds) {
        setRound(prev => prev + 1);
        startNewRound();
      } else {
        setGameOver(true);
      }
    }, 3000);
  };

  // Timer effect
  useEffect(() => {
    if (gamePhase === 'playing' && timer > 0 && !gameOver && !showCorrect && !showAnswer) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0 && !gameOver && !showCorrect && !showAnswer) {
      revealAnswer();
    }
  }, [timer, gamePhase, gameOver, showCorrect, showAnswer]);

  const resetGame = () => {
    setGamePhase('language');
    setLanguage('english');
    setCurrentParable(null);
    setGuess('');
    setScore(0);
    setGameOver(false);
    setShowAnswer(false);
    setUsedParables([]);
    setRound(1);
    setTimer(45);
    setShowCorrect(false);
  };

  // Language Selection
  if (gamePhase === 'language') {
    const parables = getParableSet();
    
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">😇</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Emoji Parables</h1>
          <p className="text-xl text-gray-600">Guess the Bible story from emojis!</p>
        </div>

       <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <button 
            onClick={() => selectLanguage('english')} 
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
        >
            <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">🇺🇸</div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">English</h2>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              {emojiParables.english.length} parables
            </p>
          </button>
          
          <button 
            onClick={() => selectLanguage('malayalam')} 
            className="bg-green-500 hover:bg-green-600 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">🇮🇳</div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">Malayalam</h2>
          <p className="text-green-100 text-xs sm:text-sm md:text-base">
              {emojiParables.malayalam?.length || 0} parables
            </p>
          </button>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-yellow-800 mb-2">How to Play:</h3>
          <ul className="text-yellow-700 text-sm list-disc list-inside space-y-1">
            <li>Guess the Bible story from the emoji sequence</li>
            <li>Earn more points for faster answers</li>
            <li>Use clues when you're stuck (costs points)</li>
            <li>8 rounds total</li>
          </ul>
        </div>

        <button onClick={onBack} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold">
          Back to Menu
        </button>
      </div>
    );
  }

  // Game Over
  if (gameOver) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Game Complete!</h2>
          
          {teamMode ? (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="font-bold text-blue-800">Team A</h3>
                  <p className="text-2xl font-bold text-blue-600">{teams.teamA} points</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <h3 className="font-bold text-red-800">Team B</h3>
                  <p className="text-2xl font-bold text-red-600">{teams.teamB} points</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-2xl text-gray-700 mb-2">
                Final Score: <span className="font-bold text-blue-600">{score}</span> points
              </p>
              <p className="text-lg text-gray-600">
                Completed {totalRounds} rounds in {language === 'english' ? 'English' : 'Malayalam'}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={resetGame} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold"
            >
              Play Again
            </button>
            <button onClick={onBack} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold">
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentParable) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setGamePhase('language')} className="text-gray-500 hover:text-gray-700 font-semibold">
          ← Language
        </button>
        <div className="text-right">
          <div className={`text-2xl font-bold mb-1 ${
            timer > 30 ? 'text-green-500' : 
            timer > 15 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {timer}s
          </div>
          <div className="text-sm text-gray-500">
            Round {round} of {totalRounds}
          </div>
          {teamMode && (
            <div className={`text-sm font-semibold mt-1 ${
              currentTeam === 'teamA' ? 'text-blue-600' : 'text-red-600'
            }`}>
              {currentTeam === 'teamA' ? "Team A's Turn" : "Team B's Turn"}
            </div>
          )}
        </div>
      </div>

      {/* Correct Answer Feedback */}
      {showCorrect && (
        <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">Correct!</h3>
          <p className="text-green-700 text-lg mb-2">
            +{Math.round(pointsEarned)} points!
          </p>
          <p className="text-green-600">
            {currentParable.reference}
          </p>
          {teamMode && (
            <p className="text-green-600 text-sm">
              Points added to {currentTeam === 'teamA' ? 'Team A' : 'Team B'}
            </p>
          )}
        </div>
      )}

      {/* Team Indicator Banner */}
      {teamMode && !showCorrect && !showAnswer && (
        <div className={`mb-4 p-3 rounded-lg text-center font-bold ${
          currentTeam === 'teamA' 
            ? 'bg-blue-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {currentTeam === 'teamA' ? "🎯 TEAM A - YOUR TURN" : "🎯 TEAM B - YOUR TURN"}
        </div>
      )}

      <div className="text-center mb-8">
        <div className="text-6xl mb-4">😇</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Emoji Parables</h2>
        <p className="text-gray-600 mb-6">
          Guess the Bible story from the emojis
        </p>

        {/* Emoji Display */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 sm:p-8 mb-6 text-center">
        <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 tracking-wider break-words leading-snug">
            {currentParable.emojis}
        </div>
        <p className="text-xs sm:text-sm text-yellow-600">
            What Bible story do these emojis represent?
        </p>
        </div>

        {/* Clues Section */}
        {!showCorrect && !showAnswer && currentClueIndex > 0 && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <h4 className="font-bold text-blue-800 mb-2">Clue {currentClueIndex}:</h4>
            <p className="text-blue-700">{currentParable.clues[currentClueIndex - 1]}</p>
          </div>
        )}

        {/* Answer Input or Revealed Answer */}
        {showAnswer ? (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-purple-800 mb-2">The Answer:</h3>
            <p className="text-3xl font-bold text-purple-600 mb-2">{currentParable.answer}</p>
            <p className="text-purple-700">{currentParable.reference}</p>
          </div>
        ) : showCorrect ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-green-800 mb-2">That's right!</h3>
            <p className="text-2xl font-bold text-green-600">{currentParable.answer}</p>
            <p className="text-green-700 text-sm mt-2">{currentParable.reference}</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); checkAnswer(); }} className="max-w-md mx-auto">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type the Bible story name..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-center text-xl font-semibold focus:border-blue-500 focus:outline-none mb-4"
              autoFocus
            />
            <div className="space-y-2">
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Submit Answer
              </button>
              
              {currentClueIndex < currentParable.clues.length && (
                <button
                  type="button"
                  onClick={nextClue}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
                >
                  Need a Clue? (-10 points)
                </button>
              )}
              
              <button
                type="button"
                onClick={revealAnswer}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
              >
                Give Up & Reveal Answer
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Current Score Display */}
      {!showCorrect && !showAnswer && (
        <div className="text-center text-sm text-gray-500">
          {teamMode ? (
            <>
              Team A: <span className="font-bold text-blue-600">{teams.teamA}</span> | 
              Team B: <span className="font-bold text-red-600">{teams.teamB}</span>
            </>
          ) : (
            <>Current Score: <span className="font-bold text-blue-600">{score}</span></>
          )}
        </div>
      )}
    </div>
  );
};

export default EmojiParables;