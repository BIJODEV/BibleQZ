import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MetaTags from './components/SEO/MetaTags'; // Import your MetaTags component
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Contact from './components/Layout/Contact';
import Home from './pages/Home';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import Results from './pages/Results';
import ImportResults from './pages/ImportResults';
import GamesApp from './components/games/GamesApp';

import './index.css';

function App() {
  return (
    <>
      <MetaTags 
        title="BibleQ - Create & Share Bible Quizzes | Free Bible Games"
        description="Create custom Bible quizzes and play interactive Bible games. Share with friends, family, and church groups. Perfect for Bible study."
        keywords="bible quiz, bible games, scripture, christian, bible study, church games"
      />
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<TakeQuiz />} />
                <Route path="/results" element={<Results />} />
                <Route path="/import-results" element={<ImportResults />} />
                <Route path="/games" element={<GamesApp />} />
                <Route path="/contact" element={<Contact />} />
                <Route 
                  path="/create" 
                  element={
                    <ProtectedRoute>
                      <CreateQuiz />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;