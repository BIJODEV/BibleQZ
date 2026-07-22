import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MetaTags from '../components/SEO/MetaTags';
import Button from '../components/UI/Button';
import bibleGamesImage from '../assets/images/games.png';
import {
  Church,
  FileText,
  Share2,
  BarChart3,
  History,
  Mic2,
  Users,
  BookOpen,
  GraduationCap,
  Heart,
  Globe,
  Gamepad2,
  Check,
  Timer,
  Trophy,
  Star,
} from 'lucide-react';

const FEATURES = [
  { icon: FileText, title: 'Create Quizzes', shortDesc: 'Multiple question types', desc: 'Create customized Bible quizzes with multiple question types.' },
  { icon: Share2, title: 'Easy Sharing', shortDesc: 'No accounts needed', desc: 'Share instantly. No accounts needed for participants.' },
  { icon: BarChart3, title: 'Live Results', shortDesc: 'Real-time tracking', desc: 'Track responses and scores in real-time.' },
  { icon: History, title: 'Results History', shortDesc: 'Track progress', desc: 'Access all quiz results anytime.' },
];

const STEPS = [
  { number: '1', title: 'Create', desc: 'Build quiz with intuitive editor' },
  { number: '2', title: 'Share', desc: 'Share link with your group' },
  { number: '3', title: 'Analyze', desc: 'View live results & insights' },
];

const USE_CASES = [
  { icon: Mic2, shortTitle: 'Sunday Sermons', shortDesc: 'Reinforce messages', desc: 'Reinforce key points from your message' },
  { icon: Users, shortTitle: 'Small Groups', shortDesc: 'Engage members', desc: 'Engage every member with interactive study' },
  { icon: BookOpen, shortTitle: 'Bible Studies', shortDesc: 'Test understanding', desc: 'Test understanding and spark discussion' },
  { icon: GraduationCap, shortTitle: 'Sunday School', shortDesc: 'All ages', desc: 'Make learning fun for all ages' },
  { icon: Heart, shortTitle: 'Youth Ministry', shortDesc: 'Connect with youth', desc: 'Connect with youth through interactive content' },
  { icon: Globe, shortTitle: 'Online Church', shortDesc: 'Virtual services', desc: 'Perfect for virtual services and groups' },
];

const GAME_STATS = [
  { icon: BarChart3, label: 'Stats' },
  { icon: Timer, label: 'Timed' },
  { icon: Trophy, label: 'Rewards' },
  { icon: Star, label: 'Stars' },
];

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
      <section className="text-center py-8 md:py-16 bg-gradient-to-br from-sky-tint-1 to-sky-tint-2 rounded-3xl">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-brand-blue to-brand-violet inline-block p-3 md:p-4 rounded-2xl mb-4 md:mb-6">
            <Church className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-ink mb-3 md:mb-6">
            Welcome to <span className="text-brand-violet">BibleQ</span>
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-slate-body mb-6 md:mb-8 leading-relaxed px-4">
            Create Bible quizzes, track results live, and deepen Scripture understanding.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4">
            <Button as={Link} to="/create" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
              {user ? 'Create Quiz' : 'Get Started Free'}
            </Button>
            {user && (
              <Button as={Link} to="/create" variant="secondary" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                Quiz History
              </Button>
            )}
            <Button as={Link} to="/games" variant="accent" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
              <Gamepad2 className="w-5 h-5" />
              <span>Games</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-3xl font-heading font-bold text-center text-ink mb-3 md:mb-4 px-4">
            Everything for Bible Study
          </h2>
          <p className="text-sm md:text-lg text-slate-body text-center mb-6 md:mb-12 max-w-2xl mx-auto px-4">
            For pastors and group leaders
          </p>

          {/* Mobile Compact Grid */}
          <div className="block md:hidden">
            <div className="grid grid-cols-2 gap-3 px-4">
              {FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm p-3 border border-mist hover:border-brand-blue transition-colors duration-200 text-center"
                >
                  <feature.icon className="w-5 h-5 text-brand-blue mx-auto mb-2" />
                  <h3 className="font-semibold text-ink mb-1 text-sm">{feature.title}</h3>
                  <p className="text-slate-body text-xs leading-tight">{feature.shortDesc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4">
            {FEATURES.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-300">
                <div className="bg-sky-tint-1 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-brand-blue" />
                </div>
                <h3 className="text-lg md:text-xl font-heading font-semibold text-ink mb-3">{feature.title}</h3>
                <p className="text-slate-body text-sm md:text-base">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 md:py-16 bg-gray-50 rounded-2xl">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-heading font-bold text-center text-ink mb-6 md:mb-12">
            Simple 3-Step Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {STEPS.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-brand-blue text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-lg md:text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-base md:text-xl font-heading font-semibold text-ink mb-2 md:mb-3">{step.title}</h3>
                <p className="text-slate-body text-xs md:text-base">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-3xl font-heading font-bold text-center text-ink mb-6 md:mb-12 px-4">
            For Every Ministry
          </h2>

          {/* Mobile Compact Grid */}
          <div className="block sm:hidden">
            <div className="grid grid-cols-2 gap-3 px-4">
              {USE_CASES.map((useCase, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm p-3 border border-mist hover:border-brand-blue transition-colors duration-200 text-center"
                >
                  <useCase.icon className="w-5 h-5 text-brand-blue mx-auto mb-2" />
                  <h3 className="font-semibold text-ink mb-1 text-xs">{useCase.shortTitle}</h3>
                  <p className="text-slate-body text-xs leading-tight">{useCase.shortDesc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
            {USE_CASES.map((useCase, index) => (
              <div key={index} className="card text-center hover:border-brand-blue transition-colors duration-300">
                <useCase.icon className="w-7 h-7 md:w-8 md:h-8 text-brand-blue mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-ink mb-2 text-base md:text-lg">{useCase.shortTitle}</h3>
                <p className="text-slate-body text-sm md:text-base">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bible Games Section */}
      <section className="py-8 md:py-16 bg-gradient-to-br from-brand-violet/10 to-brand-blue/10 rounded-2xl mb-8 md:mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6 md:mb-12">
            <div className="bg-brand-violet w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Gamepad2 className="w-6 h-6 md:w-9 md:h-9 text-white" />
            </div>
            <h2 className="text-xl md:text-3xl font-heading font-bold text-ink mb-3 md:mb-4">
              Bible Games
            </h2>
            <p className="text-base md:text-xl text-slate-body max-w-2xl mx-auto">
              Interactive challenges to test your Scripture knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
            {/* Games Description */}
            <div className="text-center lg:text-left">
              <h3 className="text-lg md:text-2xl font-heading font-semibold text-ink mb-3 md:mb-4">
                Bible Challenges
              </h3>
              <p className="text-slate-body mb-4 md:mb-6 text-sm md:text-base">
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
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button as={Link} to="/games" variant="accent" className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                <span>Play Games</span>
                <Gamepad2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Games Preview Card */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-mist hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video bg-gradient-to-br from-brand-blue to-brand-violet rounded-lg mb-3 flex items-center overflow-hidden">
                <img
                    src={bibleGamesImage}
                    alt="Bible Games Preview"
                    className="w-full h-full object-cover"
                  />
              </div>
              <h4 className="text-base md:text-lg font-heading font-semibold text-ink mb-2 text-center">
                Bible Games
              </h4>
              <p className="text-slate-body text-xs md:text-sm text-center mb-3">
                Feedback • Tracking • Levels
              </p>
              <div className="flex justify-center space-x-3">
                {GAME_STATS.map((stat, index) => (
                  <stat.icon key={index} className="w-5 h-5 text-brand-blue" aria-label={stat.label} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-brand-blue to-brand-violet rounded-2xl p-4 md:p-8 lg:p-12 text-center text-white mx-4">
        <h2 className="text-xl md:text-3xl font-heading font-bold mb-3 md:mb-4">Start Creating Bible Quizzes</h2>
        <p className="text-base md:text-xl text-blue-100 mb-4 md:mb-8 max-w-2xl mx-auto">
          Join leaders transforming Bible teaching with interactive quizzes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button as={Link} to="/create" variant="outline-inverse" className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
            Create First Quiz
          </Button>
          <Button as={Link} to="/games" variant="outline-inverse" className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
            Explore Games
          </Button>
        </div>
        {user && (
          <p className="text-blue-100 mt-3 text-xs md:text-sm">
            Welcome back! Full access available.
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
