import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Helmet } from 'react-helmet';
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
      <Helmet>
        <title>BibleQ - Bible Quiz App</title>
        <meta name="description" content="Create and take interactive Bible quizzes. Perfect for Bible study groups, Sunday schools, and personal meditation." />
        <meta name="keywords" content="bible, quiz, christian, bible study, scripture, meditation" />
      </Helmet>
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