import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MetaTags from '../components/SEO/MetaTags';

const Home = () => {
  const { user } = useAuth();

return (
  <div className="container mx-auto px-4 py-8">
    <MetaTags 
      title="BibleQ - Create Interactive Bible Quizzes for Your Group"
      description="Free Bible quiz creator for churches and study groups. Create, share, and track results in real-time. No login required for participants."
      keywords="bible quiz, bible study, christian education, sunday school, bible meditation, quiz creator"
    />
    
    {/* Hero Section */}
    <section className="text-center py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-bible-blue to-bible-purple inline-block p-3 md:p-4 rounded-2xl mb-6">
          <span className="text-4xl md:text-5xl text-white">⛪</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-bible-blue mb-4 md:mb-6">
          Welcome to <span className="text-bible-gold">BibleQ</span>
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 leading-relaxed px-4">
          Create engaging Bible quizzes, track results in real-time, and deepen your group's Scripture understanding.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4">
          <Link 
            to="/create" 
            className="btn-primary text-lg px-6 md:px-8 py-3 md:py-4 text-center"
          >
            {user ? 'Create New Quiz' : 'Get Started - Free'}
          </Link>
          {user && (
            <Link 
              to="/create" 
              className="btn-secondary text-lg px-6 md:px-8 py-3 md:py-4 text-center"
            >
              View Quiz History
            </Link>
          )}
          <a 
            href="https://bijodev.github.io/bible-quiz-app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-bible-gold hover:bg-yellow-600 text-white font-semibold text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors duration-300 text-center flex items-center justify-center space-x-2"
          >
            <span>🎮</span>
            <span>Games</span>
          </a>
        </div>
      </div>
    </section>

      {/* Features Section - Horizontal Scroll on Mobile */}
        <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-bible-blue mb-4 px-4">
            Everything You Need for Engaging Bible Study
            </h2>
            <p className="text-base md:text-lg text-gray-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Designed for pastors, small group leaders, and Bible study facilitators
            </p>
            
            {/* Mobile Horizontal Scroll */}
            <div className="block md:hidden px-4">
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {[
                {
                    icon: '📝',
                    bgColor: 'bg-blue-100',
                    title: 'Flexible Quiz Creation',
                    description: 'Create customized Bible quizzes with multiple question types and options.'
                },
                {
                    icon: '🚀',
                    bgColor: 'bg-purple-100',
                    title: 'Easy Sharing',
                    description: 'Share quizzes instantly with your group. No accounts needed for participants.'
                },
                {
                    icon: '📊',
                    bgColor: 'bg-green-100',
                    title: 'Live Results',
                    description: 'Track participant responses and scores in real-time as they complete quizzes.'
                },
                {
                    icon: '💾',
                    bgColor: 'bg-orange-100',
                    title: 'Results History',
                    description: 'Access and review all quiz results anytime. Perfect for tracking group progress.'
                }
                ].map((feature, index) => (
                <div 
                    key={index}
                    className="flex-shrink-0 w-64 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                    <div className={`${feature.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-bible-blue mb-3 text-center">
                    {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm text-center">
                    {feature.description}
                    </p>
                </div>
                ))}
            </div>
            </div>

            {/* Desktop Grid Layout */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4">
            {/* Feature 1 */}
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-100 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl md:text-3xl">📝</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-bible-blue mb-3">Flexible Quiz Creation</h3>
                <p className="text-gray-600 text-sm md:text-base">
                Create customized Bible quizzes with multiple question types and options.
                </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
                <div className="bg-purple-100 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl md:text-3xl">🚀</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-bible-blue mb-3">Easy Sharing</h3>
                <p className="text-gray-600 text-sm md:text-base">
                Share quizzes instantly with your group. No accounts needed for participants.
                </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
                <div className="bg-green-100 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl md:text-3xl">📊</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-bible-blue mb-3">Live Results</h3>
                <p className="text-gray-600 text-sm md:text-base">
                Track participant responses and scores in real-time as they complete quizzes.
                </p>
            </div>

            {/* Feature 4 */}
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
                <div className="bg-orange-100 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl md:text-3xl">💾</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-bible-blue mb-3">Results History</h3>
                <p className="text-gray-600 text-sm md:text-base">
                Access and review all quiz results anytime. Perfect for tracking group progress.
                </p>
            </div>
            </div>
        </div>
        </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-gray-50 rounded-2xl">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-bible-blue mb-8 md:mb-12">
            Simple Three-Step Process
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-bible-blue text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-bible-blue mb-3">Create</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Build your quiz with our intuitive editor. Add questions, set answers, and include explanations.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-bible-blue text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-bible-blue mb-3">Share</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Share the unique link with your group via any platform - perfect for in-person or online sessions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-bible-blue text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-bible-blue mb-3">Analyze</h3>
              <p className="text-gray-600 text-sm md:text-base">
                View live results, track participation, and gain insights for meaningful discussion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
    <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-bible-blue mb-8 md:mb-12 px-4">
            Perfect For Every Ministry Context
            </h2>
            
            {/* Mobile Horizontal Scroll */}
            <div className="block sm:hidden">
            <div className="flex space-x-4 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
                {[
                { icon: '🙏', title: 'Sunday Sermons', desc: 'Reinforce key points from your message' },
                { icon: '👥', title: 'Small Groups', desc: 'Engage every member with interactive study' },
                { icon: '📚', title: 'Bible Studies', desc: 'Test understanding and spark discussion' },
                { icon: '🎓', title: 'Sunday School', desc: 'Make learning fun for all ages' },
                { icon: '💒', title: 'Youth Ministry', desc: 'Connect with youth through interactive content' },
                { icon: '🌎', title: 'Online Church', desc: 'Perfect for virtual services and groups' }
                ].map((useCase, index) => (
                <div 
                    key={index}
                    className="flex-shrink-0 w-64 bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-bible-blue transition-colors duration-300 text-center"
                >
                    <div className="text-3xl mb-4">{useCase.icon}</div>
                    <h3 className="font-semibold text-bible-blue mb-3 text-lg">{useCase.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{useCase.desc}</p>
                </div>
                ))}
            </div>
            
            {/* Scroll Indicator */}
            <div className="text-center mt-4">
                <p className="text-xs text-gray-500">Swipe to explore more →</p>
            </div>
            </div>

            {/* Desktop Grid (unchanged) */}
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

            {/* Bible Games Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-bible-gold/10 to-bible-purple/10 rounded-2xl mb-12 md:mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <div className="bg-bible-gold w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl md:text-3xl">🎮</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-bible-blue mb-4">
              Explore Bible Games
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Challenge yourself with our collection of interactive Bible games and quizzes. Test your knowledge and have fun learning Scripture!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Games Description */}
            <div className="text-center lg:text-left">
              <h3 className="text-xl md:text-2xl font-semibold text-bible-blue mb-4">
                Interactive Bible Challenges
              </h3>
              <p className="text-gray-600 mb-6 text-base md:text-lg">
                Dive into our curated collection of Bible games featuring multiple choice quizzes, 
                scripture memorization challenges, and biblical knowledge tests. Perfect for 
                personal devotion or group activities.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  'Multiple choice Bible quizzes',
                  'Scripture memorization games',
                  'Biblical character challenges',
                  'Book and chapter recognition',
                  'Timed challenges for extra fun'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm md:text-base">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <a 
                href="https://bijodev.github.io/bible-quiz-app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-bible-gold hover:bg-yellow-600 text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors duration-300"
              >
                <span>Play Bible Games</span>
                <span>🎯</span>
              </a>
            </div>

            {/* Games Preview Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video bg-gradient-to-br from-bible-blue to-bible-purple rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl md:text-5xl text-white">📖</span>
              </div>
              <h4 className="text-lg md:text-xl font-semibold text-bible-blue mb-2 text-center">
                Bible Quiz Games
              </h4>
              <p className="text-gray-600 text-sm md:text-base text-center mb-4">
                Immediate feedback • Progress tracking • Multiple difficulty levels
              </p>
              <div className="flex justify-center space-x-2">
                {['📊', '⏱️', '🏆', '🌟'].map((emoji, index) => (
                  <span key={index} className="text-2xl" title={['Statistics', 'Timed', 'Achievements', 'Stars'][index]}>
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-bible-blue to-bible-purple rounded-2xl p-6 md:p-8 lg:p-12 text-center text-white mx-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Creating Engaging Bible Quizzes Today</h2>
        <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
          Join pastors and group leaders who are transforming their Bible teaching with interactive quizzes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link to="/create" className="bg-white text-bible-blue hover:bg-gray-100 font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors duration-300">
            Create Your First Quiz
          </Link>
          <a 
            href="https://bijodev.github.io/bible-quiz-app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border-2 border-white text-white hover:bg-white hover:text-bible-blue font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors duration-300 text-center"
          >
            Explore Bible Games
          </a>
        </div>
        {user && (
          <p className="text-blue-100 mt-4 text-sm md:text-base">
            Welcome back! You have full access to all features.
          </p>
        )}
      </section>

      {/* Footer Note */}
      <div className="text-center py-6 md:py-8 text-gray-500 text-sm md:text-base px-4">
        <p>Trusted by Bible study groups worldwide • 100% Free • No Credit Card Required</p>
      </div>
    </div>
  );
};

export default Home;