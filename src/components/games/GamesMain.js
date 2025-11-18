import React, { useState } from 'react';
import BibleQuiz from './components/BibleQuiz';
import ScrambledChapters from './components/ScrambledChapters';
import WhoAmIGame from './components/WhoAmIGame';
import BibleBookOrder from './components/BibleBookOrder';
import BibleTimeline from './components/BibleTimeline';
import EmojiParables from './components/EmojiParables';
import Footer from './components/Footer';

function GamesMain(){
  const [currentGame, setCurrentGame] = useState('menu');
  const [teamMode, setTeamMode] = useState(false);
  const [teams, setTeams] = useState({ teamA: 0, teamB: 0 });
  const [currentTeam, setCurrentTeam] = useState('teamA');

  const startTeamGame = () => {
    setTeamMode(true);
    setTeams({ teamA: 0, teamB: 0 });
    setCurrentTeam('teamA');
    setCurrentGame('menu');
  };

  const startIndividualGame = () => {
    setTeamMode(false);
    setCurrentGame('menu');
  };

  const resetScores = () => {
    setTeams({ teamA: 0, teamB: 0 });
  };

  const games = [
    {
      id: 'quiz',
      name: 'Bible Quiz',
      emoji: '❓',
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Test knowledge'
    },
    {
      id: 'scrambled',
      name: 'Scrambled',
      emoji: '🔤',
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Unscramble books'
    },
    {
      id: 'whoami',
      name: 'Who Am I?',
      emoji: '🎭',
      color: 'bg-orange-500 hover:bg-orange-600',
      description: 'Guess characters'
    },
    {
      id: 'bookorder',
      name: 'Book Order',
      emoji: '📚',
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Drag in order'
    },
    {
      id: 'timeline',
      name: 'Timeline',
      emoji: '⏳',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      description: 'Chronological order'
    },
    {
      id: 'emojis',
      name: 'Emoji Parables',
      emoji: '😇',
      color: 'bg-pink-500 hover:bg-pink-600',
      description: 'Guess from emojis'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-3 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-4 sm:mb-8">
          {/* Main Game Header */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6 mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
              📖 Youth Bible Challenge
            </h1>
            <p className="text-gray-600 text-xs sm:text-base">Fun games for spiritual growth</p>
          </div>
          
          {/* Team Scores Display */}
          {teamMode && (
            <div className="mt-3 sm:mt-4 bg-white rounded-xl shadow-lg p-3 sm:p-4 max-w-md mx-auto">
              <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">Team Scores</h3>
              <div className="flex justify-between items-center">
                <div className={`px-3 sm:px-4 py-2 rounded-lg ${currentTeam === 'teamA' ? 'bg-blue-500 text-white' : 'bg-blue-100'} text-center min-w-20`}>
                  <div className="font-bold text-xs sm:text-sm">Team A</div>
                  <div className="text-lg sm:text-xl font-bold">{teams.teamA} pts</div>
                </div>
                <div className="px-2 sm:px-4 text-gray-500 font-bold text-sm sm:text-base">VS</div>
                <div className={`px-3 sm:px-4 py-2 rounded-lg ${currentTeam === 'teamB' ? 'bg-red-500 text-white' : 'bg-red-100'} text-center min-w-20`}>
                  <div className="font-bold text-xs sm:text-sm">Team B</div>
                  <div className="text-lg sm:text-xl font-bold">{teams.teamB} pts</div>
                </div>
              </div>
              <button
                onClick={resetScores}
                className="mt-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 w-full text-center"
              >
                Reset Scores
              </button>
            </div>
          )}
        </header>

        {currentGame === 'menu' && (
          <div className="space-y-4 sm:space-y-8">
            {/* Game Mode Selection - Only show team mode button */}
            {!teamMode && (
              <div className="flex justify-center">
                <button
                  onClick={startTeamGame}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 w-full max-w-xs flex items-center justify-center gap-3"
                >
                  <div className="text-xl sm:text-2xl">👥</div>
                  <div className="text-left">
                    <h2 className="text-sm sm:text-lg font-bold">Team Play Mode</h2>
                    <p className="text-purple-100 text-xs sm:text-sm">Team A vs Team B</p>
                  </div>
                </button>
              </div>
            )}

            {/* Mobile Layout - Compact 3x2 Grid */}
            <div className="block sm:hidden">
              <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                {games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => setCurrentGame(game.id)}
                    className={`${game.color} text-white p-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 aspect-square flex flex-col items-center justify-center text-center`}
                  >
                    <div className="text-2xl mb-1">{game.emoji}</div>
                    <div className="text-xs font-semibold leading-tight mb-1">{game.name}</div>
                    <div className="text-[10px] opacity-90 leading-tight">{game.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                {games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => setCurrentGame(game.id)}
                    className={`${game.color} text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center text-center min-h-32`}
                  >
                    <div className="text-2xl sm:text-3xl mb-2">{game.emoji}</div>
                    <h2 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{game.name}</h2>
                    <p className="text-white text-opacity-90 text-xs sm:text-sm leading-tight">
                      {game.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            
            <Footer />
          </div>
        )}

        {/* Game Components */}
        {currentGame === 'quiz' && (
          <BibleQuiz 
            onBack={() => setCurrentGame('menu')} 
            teamMode={teamMode}
            teams={teams}
            setTeams={setTeams}
            currentTeam={currentTeam}
            setCurrentTeam={setCurrentTeam}
          />
        )}

        {currentGame === 'scrambled' && (
          <ScrambledChapters 
            onBack={() => setCurrentGame('menu')} 
            teamMode={teamMode}
            teams={teams}
            setTeams={setTeams}
            currentTeam={currentTeam}
            setCurrentTeam={setCurrentTeam}
          />
        )}

        {currentGame === 'whoami' && (
          <WhoAmIGame 
            onBack={() => setCurrentGame('menu')} 
            teamMode={teamMode}
            teams={teams}
            setTeams={setTeams}
            currentTeam={currentTeam}
            setCurrentTeam={setCurrentTeam}
          />
        )}

        {currentGame === 'bookorder' && (
          <BibleBookOrder 
            onBack={() => setCurrentGame('menu')} 
            teamMode={teamMode}
            teams={teams}
            setTeams={setTeams}
            currentTeam={currentTeam}
            setCurrentTeam={setCurrentTeam}
          />
        )}

        {currentGame === 'timeline' && (
          <BibleTimeline 
            onBack={() => setCurrentGame('menu')} 
            teamMode={teamMode}
            teams={teams}
            setTeams={setTeams}
            currentTeam={currentTeam}
            setCurrentTeam={setCurrentTeam}
          />
        )}

        {currentGame === 'emojis' && (
          <EmojiParables 
            onBack={() => setCurrentGame('menu')} 
            teamMode={teamMode}
            teams={teams}
            setTeams={setTeams}
            currentTeam={currentTeam}
            setCurrentTeam={setCurrentTeam}
          />
        )}
      </div>
    </div>
  );
}

export default GamesMain;