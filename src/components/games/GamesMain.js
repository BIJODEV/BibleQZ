import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  HelpCircle, 
  Shuffle, 
  UserSquare2, 
  ListOrdered, 
  Hourglass, 
  SmilePlus 
} from 'lucide-react';
import BibleQuiz from './components/BibleQuiz';
import ScrambledChapters from './components/ScrambledChapters';
import WhoAmIGame from './components/WhoAmIGame';
import BibleBookOrder from './components/BibleBookOrder';
import BibleTimeline from './components/BibleTimeline';
import EmojiParables from './components/EmojiParables';
import Footer from './components/Footer';
import Button from '../components/Button'; // Adjust path if necessary

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
      icon: HelpCircle,
      color: 'bg-brand-blue hover:bg-brand-blue/90',
      description: 'Test knowledge'
    },
    {
      id: 'scrambled',
      name: 'Scrambled',
      icon: Shuffle,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      description: 'Unscramble books'
    },
    {
      id: 'whoami',
      name: 'Who Am I?',
      icon: UserSquare2,
      color: 'bg-amber-500 hover:bg-amber-600',
      description: 'Guess characters'
    },
    {
      id: 'bookorder',
      name: 'Book Order',
      icon: ListOrdered,
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Drag in order'
    },
    {
      id: 'timeline',
      name: 'Timeline',
      icon: Hourglass,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      description: 'Chronological order'
    },
    {
      id: 'emojis',
      name: 'Emoji Parables',
      icon: SmilePlus,
      color: 'bg-rose-500 hover:bg-rose-600',
      description: 'Guess from emojis'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-10">
          {/* Main Game Header */}
          <div className="bg-white border border-mist rounded-2xl shadow-sm p-4 sm:p-8 mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-ink mb-2 flex items-center justify-center gap-3">
              <BookOpen className="w-8 h-8 text-brand-blue" />
              Youth Bible Challenge
            </h1>
            <p className="text-slate-body text-sm sm:text-base">Fun games for spiritual growth</p>
          </div>
          
          {/* Team Scores Display */}
          {teamMode && (
            <div className="mt-4 bg-white border border-mist rounded-2xl shadow-sm p-4 sm:p-6 max-w-md mx-auto">
              <h3 className="font-heading font-semibold text-ink mb-4 text-base sm:text-lg">Team Scores</h3>
              <div className="flex justify-between items-center mb-4">
                <div className={`px-4 py-3 rounded-xl border transition-colors min-w-[100px] ${
                  currentTeam === 'teamA' 
                    ? 'bg-brand-blue border-brand-blue text-white' 
                    : 'bg-brand-blue/5 border-brand-blue/20 text-brand-blue'
                }`}>
                  <div className="font-heading font-semibold text-xs sm:text-sm mb-1">Team A</div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {teams.teamA} <span className="text-xs sm:text-sm opacity-80 font-normal">pts</span>
                  </div>
                </div>
                
                <div className="px-3 sm:px-4 text-slate-body font-heading font-bold text-sm sm:text-base">
                  VS
                </div>
                
                <div className={`px-4 py-3 rounded-xl border transition-colors min-w-[100px] ${
                  currentTeam === 'teamB' 
                    ? 'bg-rose-500 border-rose-500 text-white' 
                    : 'bg-rose-50 border-rose-200 text-rose-500'
                }`}>
                  <div className="font-heading font-semibold text-xs sm:text-sm mb-1">Team B</div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {teams.teamB} <span className="text-xs sm:text-sm opacity-80 font-normal">pts</span>
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={resetScores}
                className="w-full text-xs sm:text-sm"
              >
                Reset Scores
              </Button>
            </div>
          )}
        </header>

        {currentGame === 'menu' && (
          <div className="space-y-8 sm:space-y-10">
            {/* Game Mode Selection */}
            {!teamMode && (
              <div className="flex justify-center">
                <button
                  onClick={startTeamGame}
                  className="bg-white border-2 border-brand-blue/20 hover:border-brand-blue text-ink p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-sm flex items-center justify-center gap-4 group"
                >
                  <div className="bg-brand-blue/10 p-3 rounded-full group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-brand-blue group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-base sm:text-lg font-heading font-bold">Team Play Mode</h2>
                    <p className="text-slate-body text-xs sm:text-sm">Play Team A vs Team B</p>
                  </div>
                </button>
              </div>
            )}

            {/* Unified Responsive Game Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
              {games.map((game) => {
                const GameIcon = game.icon;
                return (
                  <button
                    key={game.id}
                    onClick={() => setCurrentGame(game.id)}
                    className={`${game.color} text-white p-4 sm:p-6 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-center justify-center text-center aspect-square sm:aspect-auto sm:min-h-[160px] border border-transparent active:scale-95 sm:active:scale-100`}
                  >
                    <GameIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3" />
                    <h2 className="text-sm sm:text-lg font-heading font-bold mb-1 sm:mb-2 leading-tight">
                      {game.name}
                    </h2>
                    <p className="text-white/90 text-xs sm:text-sm leading-tight">
                      {game.description}
                    </p>
                  </button>
                );
              })}
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