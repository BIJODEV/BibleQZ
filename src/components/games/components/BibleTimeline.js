import React, { useState, useEffect } from 'react';
import { bibleTimelineEvents } from '../../../data/games/bibleTimelineData';

const BibleTimeline = ({ onBack, teamMode, teams, setTeams, currentTeam, setCurrentTeam }) => {
  const [gamePhase, setGamePhase] = useState('language');
  const [language, setLanguage] = useState('english');
  const [events, setEvents] = useState([]);
  const [shuffledEvents, setShuffledEvents] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [timer, setTimer] = useState(90);
  const [showHint, setShowHint] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [basePoints, setBasePoints] = useState(0);
  const [timeBonus, setTimeBonus] = useState(0);
  const [hintPenalty, setHintPenalty] = useState(0);

  const getEventSet = () => {
    if (language === 'malayalam' && bibleTimelineEvents.malayalam && bibleTimelineEvents.malayalam.length > 0) {
      return bibleTimelineEvents.malayalam;
    }
    return bibleTimelineEvents.english;
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    
    // Check if the selected language has events
    const eventSet = lang === 'malayalam' ? bibleTimelineEvents.malayalam : bibleTimelineEvents.english;
    
    if (!eventSet || eventSet.length === 0) {
      alert(`${lang === 'malayalam' ? 'Malayalam' : 'English'} events are not available yet. Using English instead.`);
      setLanguage('english');
      startNewRound('english');
    } else {
      startNewRound(lang);
    }
    
    setGamePhase('playing');
  };

    const startNewRound = (lang = language) => {
    // Use the provided language or current state language
    const currentLang = lang || language;
    const eventSet = currentLang === 'malayalam' && bibleTimelineEvents.malayalam && bibleTimelineEvents.malayalam.length > 0 
      ? bibleTimelineEvents.malayalam 
      : bibleTimelineEvents.english;
    
    // Debug log to check what's being fetched
    console.log('Fetching events for:', currentLang, 'Available events:', eventSet.length);
    
    if (!eventSet || eventSet.length === 0) {
      console.error('No events found for language:', currentLang);
      alert('No events available. Please check your data file.');
      return;
    }
    const selectedEvents = [];
    const usedIndices = new Set();
    
    while (selectedEvents.length < 5 && selectedEvents.length < eventSet.length) {
      const randomIndex = Math.floor(Math.random() * eventSet.length);
      if (!usedIndices.has(randomIndex)) {
        selectedEvents.push(eventSet[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }
    
    const correctOrder = [...selectedEvents].sort((a, b) => a.id - b.id);
    
    setEvents(correctOrder);
    setShuffledEvents([...selectedEvents].sort(() => Math.random() - 0.5));
    setTimer(90);
    setShowHint(false);
    setShowCorrect(false);
  };

  const checkOrder = () => {
    const isCorrect = shuffledEvents.every((event, index) => event.id === events[index].id);
    
    if (isCorrect) {
      const base = 30;
      const timeBonusValue = Math.max(0, timer * 1.5);
      const hintPenaltyValue = showHint ? 25 : 0;
      const points = base + timeBonusValue - hintPenaltyValue;
      
      setBasePoints(base);
      setTimeBonus(timeBonusValue);
      setHintPenalty(hintPenaltyValue);
      setPointsEarned(points);
      setShowCorrect(true);
      
      setTimeout(() => {
        if (teamMode) {
          setTeams(prev => ({
            ...prev,
            [currentTeam]: prev[currentTeam] + Math.round(points)
          }));
          setCurrentTeam(currentTeam === 'teamA' ? 'teamB' : 'teamA');
        } else {
          setScore(score + Math.round(points));
        }

        if (round < totalRounds) {
          setRound(round + 1);
          startNewRound();
        } else {
          setGameOver(true);
        }
      }, 3000);
    } else {
      alert("The order isn't quite right! Check the dates and try again.");
    }
  };

  const moveEvent = (fromIndex, toIndex) => {
    const newEvents = [...shuffledEvents];
    const [movedEvent] = newEvents.splice(fromIndex, 1);
    newEvents.splice(toIndex, 0, movedEvent);
    setShuffledEvents(newEvents);
  };

  const toggleHint = () => {
    if (!showCorrect) {
      setShowHint(!showHint);
    }
  };

  useEffect(() => {
    if (gamePhase === 'playing' && timer > 0 && !gameOver && !showCorrect) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0 && !gameOver && !showCorrect) {
      if (round < totalRounds) {
        setRound(round + 1);
        startNewRound();
      } else {
        setGameOver(true);
      }
    }
  }, [timer, gamePhase, gameOver, showCorrect]);

  // Language Selection
  if (gamePhase === 'language') {
    const eventSet = getEventSet();
    
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-md mx-3 sm:mx-auto my-2 sm:my-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">⏳</div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Bible Timeline Challenge</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">Arrange Biblical events in chronological order</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <button 
            onClick={() => selectLanguage('english')} 
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300"
          >
            <div className="text-2xl sm:text-3xl md:text-4xl mb-2">🇺🇸</div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">English</h2>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              {bibleTimelineEvents.english.length} events
            </p>
          </button>
          
          <button 
            onClick={() => selectLanguage('malayalam')} 
            className="bg-green-500 hover:bg-green-600 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300"
          >
            <div className="text-2xl sm:text-3xl md:text-4xl mb-2">🇮🇳</div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Malayalam</h2>
            <p className="text-green-100 text-xs sm:text-sm md:text-base">
              {bibleTimelineEvents.malayalam?.length || 0} events
            </p>
          </button>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-6">
          <h3 className="font-bold text-yellow-800 mb-2 text-sm sm:text-base">How to Play:</h3>
          <ul className="text-yellow-700 text-xs sm:text-sm list-disc list-inside space-y-1">
            <li>Arrange 5 Biblical events in chronological order</li>
            <li>Drag and drop to reorder events</li>
            <li>Earn bonus points for faster completion</li>
            <li>Use hints wisely - they cost points!</li>
          </ul>
        </div>

        <button onClick={onBack} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base">
          Back to Menu
        </button>
      </div>
    );
  }

  // Game Over
  if (gameOver) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-2xl mx-3 sm:mx-4 md:mx-auto my-2 sm:my-4">
        <div className="text-center">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-4">🏆</div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6">Timeline Challenge Complete!</h2>
          
          {teamMode ? (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="font-bold text-blue-800 text-sm sm:text-base">Team A</h3>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{teams.teamA} points</p>
                </div>
                <div className="bg-red-50 p-3 sm:p-4 rounded-lg border-2 border-red-200">
                  <h3 className="font-bold text-red-800 text-sm sm:text-base">Team B</h3>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{teams.teamB} points</p>
                </div>
              </div>
              {teams.teamA === teams.teamB ? (
                <p className="text-lg sm:text-xl text-gray-600">It's a tie! 🎉</p>
              ) : (
                <p className="text-lg sm:text-xl text-gray-600">
                  {teams.teamA > teams.teamB ? 'Team A' : 'Team B'} wins! 🎉
                </p>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-2">
                Final Score: <span className="font-bold text-blue-600">{score}</span> points
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Completed {totalRounds} rounds in {language === 'english' ? 'English' : 'Malayalam'}
              </p>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <button 
              onClick={() => { setGameOver(false); setRound(1); setScore(0); setGamePhase('language'); }} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base"
            >
              Play Again
            </button>
            <button onClick={onBack} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base">
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Phase
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 max-w-4xl mx-3 sm:mx-4 md:mx-auto my-2 sm:my-4">
      <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
        <button 
          onClick={() => setGamePhase('language')}
          className="bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md w-11 h-11 flex items-center justify-center"
        >
          <span className="text-2xl">←</span>
        </button>
        <div className="text-right">
          <div className={`text-xl sm:text-2xl font-bold mb-1 ${
            timer > 60 ? 'text-green-500' : 
            timer > 30 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {timer}s
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            Round {round} of {totalRounds}
          </div>
          {teamMode && (
            <div className={`text-xs sm:text-sm font-semibold mt-1 ${
              currentTeam === 'teamA' ? 'text-blue-600' : 'text-red-600'
            }`}>
              {currentTeam === 'teamA' ? "Team A's Turn" : "Team B's Turn"}
            </div>
          )}
        </div>
      </div>

      {/* Correct Answer Feedback */}
      {showCorrect && (
        <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
          <div className="text-3xl sm:text-4xl mb-3">🎉</div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-800 mb-3">Perfect Timeline!</h3>
          
          {/* Points Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-4">
            <div className="bg-white rounded-lg p-2 sm:p-3 border border-green-200">
              <div className="text-xs sm:text-sm text-gray-600">Base Points</div>
              <div className="text-lg sm:text-xl font-bold text-green-600">+{basePoints}</div>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 border border-green-200">
              <div className="text-xs sm:text-sm text-gray-600">Time Bonus</div>
              <div className="text-lg sm:text-xl font-bold text-green-600">+{Math.round(timeBonus)}</div>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 border border-green-200">
              <div className="text-xs sm:text-sm text-gray-600">Hint Penalty</div>
              <div className="text-lg sm:text-xl font-bold text-red-600">-{hintPenalty}</div>
            </div>
          </div>
          
          <div className="bg-green-100 rounded-lg p-3 sm:p-4 mb-3">
            <div className="text-base sm:text-lg font-bold text-green-800">
              Total: +{Math.round(pointsEarned)} points!
            </div>
            {teamMode && (
              <p className="text-green-700 mt-1 text-sm">
                Points added to {currentTeam === 'teamA' ? 'Team A' : 'Team B'}
              </p>
            )}
          </div>
          
          <p className="text-green-600 text-sm">Moving to next round...</p>
        </div>
      )}

      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">Arrange Events Chronologically</h2>
        <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
          Language: {language === 'english' ? 'English' : 'Malayalam'}
        </p>

        {/* Timeline Display */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700">
              {showCorrect ? "Correct Timeline Order:" : "Current Order:"}
            </h3>
            {!showCorrect && (
              <button
                onClick={toggleHint}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm ${
                  showHint 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showHint ? 'Hide Dates' : 'Show Dates (-25)'}
              </button>
            )}
          </div>

          <div className="space-y-2 sm:space-y-3">
            {(showCorrect ? events : shuffledEvents).map((event, index) => (
              <div
                key={event.id}
                draggable={!showCorrect}
                onDragStart={(e) => !showCorrect && e.dataTransfer.setData('text/plain', index)}
                onDragOver={(e) => !showCorrect && e.preventDefault()}
                onDrop={(e) => {
                  if (!showCorrect) {
                    e.preventDefault();
                    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    moveEvent(fromIndex, index);
                  }
                }}
                className={`border-2 rounded-lg p-3 sm:p-4 transition-all ${
                  showCorrect 
                    ? 'bg-green-100 border-green-400' 
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 cursor-move hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left flex-1 mr-2">
                    <h4 className="font-bold text-gray-800 text-sm sm:text-base">{event.event}</h4>
                    {/* <p className="text-gray-600 text-xs sm:text-sm">{event.reference}</p> */}
                    {(showHint || showCorrect) && (
                      <p className="text-orange-600 font-semibold text-xs sm:text-sm mt-1">
                        Approx: {event.approximateDate}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-xs sm:text-sm ${
                      showCorrect ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">Position</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!showCorrect && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <button
              onClick={checkOrder}
              className="bg-green-500 hover:bg-green-600 text-white py-2.5 sm:py-3 px-4 sm:px-8 rounded-lg font-semibold text-sm sm:text-base transition-colors"
            >
              Check Timeline
            </button>
            
            <button
              onClick={startNewRound}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base transition-colors"
            >
              Skip Round
            </button>
          </div>
        )}

        {/* Current Score Display */}
        {!showCorrect && (
          <div className="mt-4 sm:mt-6 bg-gray-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
              {teamMode ? 'Current Team Scores' : 'Current Score'}
            </h4>
            {teamMode ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="text-center">
                  <div className="font-bold text-blue-600">Team A</div>
                  <div className="text-base sm:text-lg">{teams.teamA}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-red-600">Team B</div>
                  <div className="text-base sm:text-lg">{teams.teamB}</div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-xs sm:text-sm text-gray-600">points</div>
              </div>
            )}
            
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
              <h5 className="font-semibold text-gray-700 mb-1 text-xs sm:text-sm">Scoring This Round:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 text-xs text-gray-600">
                <div>Base: 30 points</div>
                <div>Time Bonus: +{Math.max(0, timer * 1.5)}</div>
                <div>Hint Penalty: {showHint ? '-25' : '0'} points</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleTimeline;