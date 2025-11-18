import React, { useState, useEffect } from 'react';
import { bibleCharacters as englishCharacters } from '../../../data/games/WhoAmIData';
import { bibleCharacters as malayalamCharacters } from '../../../data/games/WhoAmIDataMalayalam';

const WhoAmIGame = ({ onBack, teamMode, teams, setTeams, currentTeam, setCurrentTeam }) => {
  const [gamePhase, setGamePhase] = useState('language'); // 'language', 'setup', 'playing', 'finished'
  const [language, setLanguage] = useState('english');
  const [characterCount, setCharacterCount] = useState(4);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [usedCharacters, setUsedCharacters] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(20);
  const [charactersPlayed, setCharactersPlayed] = useState(0);
  const [totalCharacters, setTotalCharacters] = useState(4);

  const characterOptions = [4, 8, 12];

  // Get the appropriate character set based on language
  const getCharacterSet = () => {
    return language === 'malayalam' ? malayalamCharacters : englishCharacters;
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setGamePhase('setup');
  };

  const startGame = () => {
    setTotalCharacters(characterCount);
    setCharactersPlayed(0);
    setUsedCharacters([]);
    setGamePhase('playing');
    pickNewCharacter();
  };

  // Timer effect
  useEffect(() => {
    if (currentCharacter && timer > 0 && !showAnswer && !gameOver && gamePhase === 'playing') {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0 && currentCharacter && !showAnswer && !gameOver) {
      // Auto-show next clue when timer reaches 0
      if (currentClueIndex < currentCharacter.clues.length - 1) {
        nextClue();
      } else {
        // No more clues, reveal answer
        revealAnswer();
      }
    }
  }, [timer, currentCharacter, showAnswer, gameOver, gamePhase]);

  const pickNewCharacter = () => {
    const characters = getCharacterSet();
    const availableCharacters = characters.filter(char => 
      !usedCharacters.includes(char.name)
    );
    
    if (availableCharacters.length === 0 || charactersPlayed >= totalCharacters) {
      setGameOver(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    const newCharacter = availableCharacters[randomIndex];
    setCurrentCharacter(newCharacter);
    setCurrentClueIndex(0);
    setGuess('');
    setShowAnswer(false);
    setTimer(20);
    setUsedCharacters(prev => [...prev, newCharacter.name]);
  };

  const nextClue = () => {
    if (currentClueIndex < currentCharacter.clues.length - 1) {
      setCurrentClueIndex(currentClueIndex + 1);
      setTimer(20);
      setGuess('');
    }
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (guess.trim().toUpperCase() === currentCharacter.name) {
      // Fewer clues used = more points (50, 40, 30, 20, 10)
      const points = (currentCharacter.clues.length - currentClueIndex) * 10;
      
      if (teamMode) {
        setTeams(prev => ({
          ...prev,
          [currentTeam]: prev[currentTeam] + points
        }));
      } else {
        setScore(score + points);
      }
      
      // Update characters played and check if game should continue
      const newCharactersPlayed = charactersPlayed + 1;
      setCharactersPlayed(newCharactersPlayed);
      
      if (newCharactersPlayed >= totalCharacters) {
        setGameOver(true);
      } else {
        // Switch teams only if game continues
        if (teamMode) {
          setCurrentTeam(currentTeam === 'teamA' ? 'teamB' : 'teamA');
        }
        pickNewCharacter();
      }
    } else {
      alert("Not quite! Try again or wait for the next clue.");
      setGuess('');
    }
  };

  const revealAnswer = () => {
    setShowAnswer(true);
    setTimeout(() => {
      const newCharactersPlayed = charactersPlayed + 1;
      setCharactersPlayed(newCharactersPlayed);
      
      if (newCharactersPlayed >= totalCharacters) {
        setGameOver(true);
      } else {
        // Switch teams only if game continues
        if (teamMode) {
          setCurrentTeam(currentTeam === 'teamA' ? 'teamB' : 'teamA');
        }
        pickNewCharacter();
      }
    }, 3000);
  };

  const resetGame = () => {
    setGamePhase('language');
    setLanguage('english');
    setCharacterCount(4);
    setCurrentCharacter(null);
    setCurrentClueIndex(0);
    setScore(0);
    setGuess('');
    setShowAnswer(false);
    setUsedCharacters([]);
    setGameOver(false);
    setTimer(20);
    setCharactersPlayed(0);
  };

  const backToLanguage = () => {
    setGamePhase('language');
  };

  const backToSetup = () => {
    setGamePhase('setup');
  };

  // Language Selection Phase
  if (gamePhase === 'language') {
    const characters = getCharacterSet();
    
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌍</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Select Language</h1>
          <p className="text-xl text-gray-600">Choose your preferred language for the game</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <button
            onClick={() => selectLanguage('english')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">🇺🇸</div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">English</h2>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              {englishCharacters.length} characters available
            </p>
          </button>

          <button
            onClick={() => selectLanguage('malayalam')}
            className="bg-green-500 hover:bg-green-600 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">🇮🇳</div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">Malayalam</h2>
          <p className="text-green-100 text-xs sm:text-sm md:text-base">
              {malayalamCharacters.length} characters available
            </p>
          </button>
        </div>

        <button
          onClick={onBack}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  // Setup Phase
  if (gamePhase === 'setup') {
    const characters = getCharacterSet();
    
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Game Setup</h1>
          <p className="text-xl text-gray-600">Choose how many characters to guess</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Number of Characters</h2>
            <button
              onClick={backToLanguage}
              className="text-blue-500 hover:text-blue-700 font-semibold text-sm"
            >
              ← Change Language
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {characterOptions.map((count) => (
              <button
                key={count}
                onClick={() => setCharacterCount(count)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  characterCount === count
                    ? 'bg-blue-500 border-blue-500 text-white transform scale-105'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="text-xl font-bold">{count}</div>
                <div className="text-sm">characters</div>
              </button>
            ))}
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-800">
                Selected: {characterCount} characters in {language === 'english' ? 'English' : 'Malayalam'}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Total available: {characters.length} characters
              </p>
              {teamMode && (
                <p className="text-sm text-blue-600 mt-1">
                  Teams will alternate turns
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={startGame}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors"
          >
            Start Game with {characterCount} Characters
          </button>
          <button
            onClick={onBack}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // Game Over Phase
  if (gameOver) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Game Complete!
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            {charactersPlayed} characters guessed in {language === 'english' ? 'English' : 'Malayalam'}
          </p>
          
          {teamMode ? (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`p-4 rounded-lg ${teams.teamA > teams.teamB ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100'}`}>
                  <h3 className="font-bold text-lg">Team A</h3>
                  <p className="text-2xl font-bold">{teams.teamA} points</p>
                </div>
                <div className={`p-4 rounded-lg ${teams.teamB > teams.teamA ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100'}`}>
                  <h3 className="font-bold text-lg">Team B</h3>
                  <p className="text-2xl font-bold">{teams.teamB} points</p>
                </div>
              </div>
              {teams.teamA === teams.teamB ? (
                <p className="text-xl text-gray-600">It's a tie! 🎉</p>
              ) : (
                <p className="text-xl text-gray-600">
                  {teams.teamA > teams.teamB ? 'Team A' : 'Team B'} wins! 🎉
                </p>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-2xl text-gray-700">
                Your final score: <span className="font-bold text-blue-600">{score}</span> points!
              </p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={resetGame}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCharacter) {
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
        <button
          onClick={backToSetup}
          className="text-gray-500 hover:text-gray-700 font-semibold"
        >
          ← Setup
        </button>
        
        <div className="text-right">
          {/* Timer Display */}
          <div className={`text-2xl font-bold mb-1 ${
            timer > 10 ? 'text-green-500' : 
            timer > 5 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {timer}s
          </div>
          
          <div className="text-xs text-gray-400 mb-1">
            Character {charactersPlayed + 1} of {totalCharacters}
          </div>

          {teamMode ? (
            <div className="text-center">
              <div className="flex gap-2 text-sm">
                <div className={`px-2 py-1 rounded ${currentTeam === 'teamA' ? 'bg-blue-500 text-white' : 'bg-blue-100'}`}>
                  A: {teams.teamA}
                </div>
                <div className={`px-2 py-1 rounded ${currentTeam === 'teamB' ? 'bg-red-500 text-white' : 'bg-red-100'}`}>
                  B: {teams.teamB}
                </div>
              </div>
              <div className={`text-xs font-semibold mt-1 ${currentTeam === 'teamA' ? 'text-blue-600' : 'text-red-600'}`}>
                {currentTeam === 'teamA' ? "Team A's turn" : "Team B's turn"}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Score: {score}</div>
          )}
        </div>
      </div>

      {/* Team Indicator Banner */}
      {teamMode && (
        <div className={`mb-4 p-3 rounded-lg text-center font-bold ${
          currentTeam === 'teamA' 
            ? 'bg-blue-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {currentTeam === 'teamA' ? "🎯 TEAM A - YOUR TURN" : "🎯 TEAM B - YOUR TURN"}
          <div className="text-sm font-normal mt-1">
            Character {charactersPlayed + 1} of {totalCharacters}
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🤔</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Who Am I?</h2>
        
        {/* Progress indicator */}
        <div className="flex justify-center items-center mb-4">
          <div className="text-gray-600 mr-3">
            Clue {currentClueIndex + 1} of {currentCharacter.clues.length}
          </div>
          <div className="flex space-x-1">
            {currentCharacter.clues.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentClueIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Timer Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              timer > 10 ? 'bg-green-500' : 
              timer > 5 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${(timer / 20) * 100}%` }}
          />
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
          <p className="text-xl font-semibold text-gray-800">
            "{currentCharacter.clues[currentClueIndex]}"
          </p>
        </div>

        {currentClueIndex < currentCharacter.clues.length - 1 && (
          <div className="mb-4">
            <button
              onClick={nextClue}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
            >
              Need Another Clue? (Next guess: {(currentCharacter.clues.length - currentClueIndex - 1) * 10} points)
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Next clue in: {timer} seconds
            </p>
          </div>
        )}

        <form onSubmit={handleGuess} className="max-w-md mx-auto">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Type your guess here..."
            className="w-full p-4 border-2 border-gray-200 rounded-lg text-center text-xl font-semibold focus:border-blue-500 focus:outline-none mb-4"
            autoFocus
          />
          <div className="space-y-2">
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Submit Guess
            </button>
            <button
              type="button"
              onClick={revealAnswer}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
            >
              Give Up & Reveal Answer
            </button>
          </div>
        </form>
      </div>

      {showAnswer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">It was...</h3>
            <p className="text-4xl font-bold text-blue-600 mb-4">{currentCharacter.name}</p>
            <p className="text-gray-600 mb-2">Fun fact:</p>
            <p className="text-gray-700 italic">
              {currentCharacter.funFacts[Math.floor(Math.random() * currentCharacter.funFacts.length)]}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Language: {language === 'english' ? 'English' : 'Malayalam'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhoAmIGame;