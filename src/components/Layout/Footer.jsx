import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bible-blue text-white py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand & Description */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="bg-bible-gold p-2 rounded-lg">
              <span className="text-bible-blue font-bold text-lg">⛪</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">BibleQ</h3>
              <p className="text-blue-200 text-sm">
                &copy; {currentYear} Helping groups grow in Scripture
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6 text-sm">
            <Link to="/" className="text-blue-200 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/create" className="text-blue-200 hover:text-white transition-colors">
              Create Quiz
            </Link>
            <a 
              href="https://bijodev.github.io/bible-quiz-app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white transition-colors"
            >
              Games
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;