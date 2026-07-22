import React from 'react';
import { Link } from 'react-router-dom';
import { Church } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-blue text-white py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand & Description */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="bg-brand-violet p-2 rounded-btn">
              <Church className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold">BibleQ</h3>
              <p className="text-blue-200 text-sm">
                {`© ${currentYear} Helping groups grow in Scripture`}
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
            <Link to="/games" className="text-blue-200 hover:text-white transition-colors">
              Games
            </Link>
            <Link to="/contact" className="text-blue-200 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
