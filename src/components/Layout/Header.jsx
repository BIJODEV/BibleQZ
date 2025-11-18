import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-bible-blue text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-bible-gold p-2 rounded-lg">
              <span className="text-bible-blue font-bold text-2xl">⛪</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">BibleQ</h1>
              <p className="text-sm text-blue-200">Meditate • Learn • Grow</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-bible-gold transition-colors font-medium">
              Home
            </Link>
            <Link to="/create" className="hover:text-bible-gold transition-colors font-medium">
              Create Quiz
            </Link>

            <Link to="/games" className="hover:text-bible-gold transition-colors font-medium flex items-center space-x-1">
              Games
            </Link>

            <Link to="/contact" className="hover:text-bible-gold transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-3 border-t border-blue-600 pt-4">
            <Link 
              to="/" 
              className="block hover:text-bible-gold transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/create" 
              className="block hover:text-bible-gold transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Quiz
            </Link>
            <Link 
              to="/games"
              className="block hover:text-bible-gold transition-colors font-medium py-2 flex items-center space-x-2"
              onClick={() => setIsMenuOpen(false)}
              >
              Games
            </Link>

            <Link 
              to="/contact" 
              className="block hover:text-bible-gold transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;