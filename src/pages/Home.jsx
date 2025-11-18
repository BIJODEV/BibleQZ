import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MetaTags from '../components/SEO/MetaTags';
import bibleGamesImage from '../assets/images/games.png';


const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <MetaTags 
        title="BibleQ - Create Interactive Bible Quizzes for Your Group"
        description="Free Bible quiz creator for churches and study groups. Create, share, and track results in real-time. No login required for participants."
        keywords="bible quiz, bible study, christian education, sunday school, bible meditation, quiz creator"
      />
      
      {/* Hero Section - More Compact */}
      <section className="text-center py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-bible-blue to-bible-purple inline-block p-3 md:p-4 rounded-2xl mb-4 md:mb-6">
            <span className="text-4xl md:text-5xl text-white">⛪</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-bible-blue mb-3 md:mb-6">
            Welcome to <span className="text-bible-gold">BibleQ</span>
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 leading-relaxed px-4">
            Create Bible quizzes, track results live, and deepen Scripture understanding.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4">
            <Link 
              to="/create" 
              className="btn-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 text-center"
            >
              {user ? 'Create Quiz' : 'Get Started Free'}
            </Link>
            {user && (
              <Link 
                to="/create" 
                className="btn-secondary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 text-center"
              >
                Quiz History
              </Link>
            )}
            <a 
              href="https://bijodev.github.io/bible-quiz-app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-bible-gold hover:bg-yellow-600 text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors duration-300 text-center flex items-center justify-center space-x-2"
            >
              <span>🎮</span>
              <span>Games</span>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section - Compact Mobile Cards */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center text-bible-blue mb-3 md:mb-4 px-4">
            Everything for Bible Study
          </h2>
          <p className="text-sm md:text-lg text-gray-600 text-center mb-6 md:mb-12 max-w-2xl mx-auto px-4">
            For pastors and group leaders
          </p>
          
          {/* Mobile Compact Grid */}
          <div className="block md:hidden">
            <div className="grid grid-cols-2 gap-3 px-4">
              {[
                { icon: '📝', title: 'Create Quizzes', desc: 'Multiple question types' },
                { icon: '🚀', title: 'Easy Sharing', desc: 'No accounts needed' },
                { icon: '📊', title: 'Live Results', desc: 'Real-time tracking' },
                { icon: '💾', title: 'Results History', desc: 'Track progress' }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:border-bible-blue transition-colors duration-200 text-center"
                >
                  <div className="text-xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-bible-blue mb-1 text-sm">{feature.title}</h3>
                  <p className="text-gray-600 text-xs leading-tight">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4">
            {[
              { icon: '📝', title: 'Flexible Quiz Creation', desc: 'Create customized Bible quizzes with multiple question types.' },
              { icon: '🚀', title: 'Easy Sharing', desc: 'Share instantly. No accounts needed for participants.' },
              { icon: '📊', title: 'Live Results', desc: 'Track responses and scores in real-time.' },
              { icon: '💾', title: 'Results History', desc: 'Access all quiz results anytime.' }
            ].map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-100 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl md:text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-bible-blue mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - More Compact */}
      <section className="py-8 md:py-16 bg-gray-50 rounded-2xl">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold text-center text-bible-blue mb-6 md:mb-12">
            Simple 3-Step Process
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {[
              { number: '1', title: 'Create', desc: 'Build quiz with intuitive editor' },
              { number: '2', title: 'Share', desc: 'Share link with your group' },
              { number: '3', title: 'Analyze', desc: 'View live results & insights' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-bible-blue text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-lg md:text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-base md:text-xl font-semibold text-bible-blue mb-2 md:mb-3">{step.title}</h3>
                <p className="text-gray-600 text-xs md:text-base">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases - Compact Mobile */}
      <section className="py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center text-bible-blue mb-6 md:mb-12 px-4">
            For Every Ministry
          </h2>
          
          {/* Mobile Compact Grid */}
          <div className="block sm:hidden">
            <div className="grid grid-cols-2 gap-3 px-4">
              {[
                { icon: '🙏', title: 'Sermons', desc: 'Reinforce messages' },
                { icon: '👥', title: 'Small Groups', desc: 'Engage members' },
                { icon: '📚', title: 'Bible Studies', desc: 'Test understanding' },
                { icon: '🎓', title: 'Sunday School', desc: 'All ages' },
                { icon: '💒', title: 'Youth Ministry', desc: 'Connect with youth' },
                { icon: '🌎', title: 'Online Church', desc: 'Virtual services' }
              ].map((useCase, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:border-bible-blue transition-colors duration-200 text-center"
                >
                  <div className="text-xl mb-2">{useCase.icon}</div>
                  <h3 className="font-semibold text-bible-blue mb-1 text-xs">{useCase.title}</h3>
                  <p className="text-gray-600 text-xs leading-tight">{useCase.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
            {[
              { icon: '🙏', title: 'Sunday Sermons', desc: 'Reinforce key points from your message' },
              { icon: '👥', title: 'Small Groups', desc: 'Engage every member with interactive study' },
              { icon: '📚', title: 'Bible Studies', desc: 'Test understanding and spark discussion' },
              { icon: '🎓', title: 'Sunday School', desc: 'Make learning fun for all ages' },
              { icon: '💒', title: 'Youth Ministry', desc: 'Connect with youth through interactive content' },
              { icon: '🌎', title: 'Online Church', desc: 'Perfect for virtual services and groups' }
            ].map((useCase, index) => (
              <div key={index} className="card text-center hover:border-bible-blue transition-colors duration-300">
                <div className="text-2xl md:text-3xl mb-3">{useCase.icon}</div>
                <h3 className="font-semibold text-bible-blue mb-2 text-base md:text-lg">{useCase.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bible Games Section - More Compact */}
      <section className="py-8 md:py-16 bg-gradient-to-br from-bible-gold/10 to-bible-purple/10 rounded-2xl mb-8 md:mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6 md:mb-12">
            <div className="bg-bible-gold w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <span className="text-xl md:text-3xl">🎮</span>
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-bible-blue mb-3 md:mb-4">
              Bible Games
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
              Interactive challenges to test your Scripture knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
            {/* Games Description - More Compact */}
            <div className="text-center lg:text-left">
              <h3 className="text-lg md:text-2xl font-semibold text-bible-blue mb-3 md:mb-4">
                Bible Challenges
              </h3>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                Multiple choice quizzes, memorization games, and character challenges for personal or group use.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4 md:mb-6">
                {[
                  'Multiple choice',
                  'Scripture games',
                  'Bible characters',
                  'Book recognition'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs md:text-sm">
                    <span className="text-green-500 text-sm">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <a 
                href="https://bijodev.github.io/bible-quiz-app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-bible-gold hover:bg-yellow-600 text-white font-semibold text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors duration-300"
              >
                <span>Play Games</span>
                <span>🎯</span>
              </a>
            </div>

            {/* Games Preview Card - More Compact */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video bg-gradient-to-br from-bible-blue to-bible-purple rounded-lg mb-3 flex items-center overflow-hidden">
                <img 
                    src={bibleGamesImage} 
                    alt="Bible Games Preview"
                    className="w-full h-full object-cover"
                  />
              </div>
              <h4 className="text-base md:text-lg font-semibold text-bible-blue mb-2 text-center">
                Bible Games
              </h4>
              <p className="text-gray-600 text-xs md:text-sm text-center mb-3">
                Feedback • Tracking • Levels
              </p>
              <div className="flex justify-center space-x-2">
                {['📊', '⏱️', '🏆', '🌟'].map((emoji, index) => (
                  <span key={index} className="text-xl" title={['Stats', 'Timed', 'Rewards', 'Stars'][index]}>
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - More Compact */}
      <section className="bg-gradient-to-r from-bible-blue to-bible-purple rounded-2xl p-4 md:p-8 lg:p-12 text-center text-white mx-4">
        <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">Start Creating Bible Quizzes</h2>
        <p className="text-base md:text-xl text-blue-100 mb-4 md:mb-8 max-w-2xl mx-auto">
          Join leaders transforming Bible teaching with interactive quizzes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Link to="/create" className="bg-white text-bible-blue hover:bg-gray-100 font-semibold text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors duration-300">
            Create First Quiz
          </Link>
          <a 
            href="https://bijodev.github.io/bible-quiz-app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-white text-white hover:bg-white hover:text-bible-blue font-semibold text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors duration-300 text-center"
          >
            Explore Games
          </a>
        </div>
        {user && (
          <p className="text-blue-100 mt-3 text-xs md:text-sm">
            Welcome back! Full access available.
          </p>
        )}
      </section>

      {/* Footer Note - More Compact */}
      <div className="text-center py-4 md:py-6 text-gray-500 text-xs md:text-sm px-4">
        <p>Trusted worldwide • 100% Free • No Card Required</p>
      </div>
    </div>
  );
};

export default Home;