import React, { useState } from 'react';

const Footer = () => {
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200/60">
      {/* Simple Copyright Footer */}
      <div className="text-center text-gray-500 text-xs sm:text-sm mb-4">
        <p>© {currentYear} Youth Bible Challenge. Built with ❤️ for spiritual growth.</p>
      </div>

      {/* Know Your Church - Minimal Footer Link */}
      <div className="relative flex flex-col items-center">
        {/* Desktop Hover Container */}
        <div className="group relative inline-block">
          <a 
            href="https://knowurchurch.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors cursor-pointer"
            onClick={() => setShowMobileTooltip(!showMobileTooltip)}
          >
            <span className="text-sm">⛪</span>
            <span className="text-xs sm:text-sm font-medium">Know Your Church</span>
            <span className="text-xs text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
              Visit website →
            </span>
          </a>

          {/* Desktop Hover Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden sm:group-hover:block z-10 w-64">
            <div className="bg-white border border-purple-200 rounded-lg shadow-lg p-3">
              <h4 className="font-bold text-purple-800 mb-2 text-sm">Digital Transformation for Churches</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-purple-500 text-xs">●</span>
                    <span>Multi-level Access</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-purple-500 text-xs">●</span>
                    <span>Attendance</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-purple-500 text-xs">●</span>
                    <span>Classes</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-purple-500 text-xs">●</span>
                    <span>Gallery</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-purple-500 text-xs">●</span>
                    <span>Dashboards</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-purple-500 text-xs">●</span>
                    <span>Records</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded p-2 border border-purple-100">
                <p className="text-xs text-purple-700 text-center">
                  Modernizing Sunday School programs through technology
                </p>
              </div>

              {/* Add a direct call-to-action button */}
              <a 
                href="https://knowurchurch.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full mt-2 bg-purple-500 text-white py-2 rounded font-medium text-xs text-center hover:bg-purple-600 transition-colors"
              >
                Visit Know Your Church
              </a>
            </div>
          </div>
        </div>

        {/* Support Email - Always visible but subtle */}
        <div className="text-center mt-2">
          <a 
            href="mailto:knowyourchurch07@gmail.com?subject=Know Your Church App Inquiry&body=Hello, I'd like to learn more about the church management platform and how I can support this initiative."
            className="text-xs text-gray-400 hover:text-purple-500 transition-colors inline-flex items-center space-x-1"
          >
            <span>📧</span>
            <span>Support Inquiry</span>
          </a>
        </div>

        {/* Mobile Touch Tooltip */}
        {showMobileTooltip && (
          <div className="sm:hidden mt-3 bg-white border border-purple-200 rounded-lg shadow-lg p-3 w-full max-w-xs">
            <h4 className="font-bold text-purple-800 mb-2 text-sm">Digital Transformation for Churches</h4>
            
            <div className="text-xs text-gray-600 mb-2 space-y-1">
              <div className="flex items-center space-x-1">
                <span className="text-purple-500">●</span>
                <span>Multi-level Access & Attendance Tracking</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-purple-500">●</span>
                <span>Class Management & Gallery System</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-purple-500">●</span>
                <span>Role-based Dashboards & Student Records</span>
              </div>
            </div>

            <div className="bg-purple-50 rounded p-2 border border-purple-100">
              <p className="text-xs text-purple-700 text-center">
                Helping churches modernize Sunday School programs
              </p>
            </div>

            {/* Mobile CTA Button */}
            <a 
              href="https://knowurchurch.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full mt-2 bg-purple-500 text-white py-2 rounded font-medium text-xs text-center hover:bg-purple-600 transition-colors"
            >
              Visit Website
            </a>
            
            <button
              onClick={() => setShowMobileTooltip(false)}
              className="w-full mt-2 bg-gray-500 text-white py-1 rounded font-medium text-xs"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Footer;