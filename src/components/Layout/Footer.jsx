import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bible-blue text-white py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <div className="bg-bible-gold p-1 rounded">
            <span className="text-bible-blue text-sm">⛪</span>
          </div>
          <h3 className="text-xl font-bold">BibleQ</h3>
        </div>
        <p className="text-blue-200">
          Helping groups meditate on God's Word together
        </p>
        <p className="text-blue-300 text-sm mt-2">
          &copy; {currentYear} BibleQ. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
