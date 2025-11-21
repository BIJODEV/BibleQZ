import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-bible-blue mb-6">Contact Us</h1>
        <p className="text-gray-600 mb-6">
          Have feedback, ideas, or just want to say hello? We'd love to hear from you!
        </p>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-bible-blue mb-3">Get in Touch</h2>
          <a 
            href="mailto:bijodev1@gmail.com"
            className="inline-flex items-center space-x-2 bg-bible-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>✉️</span>
            <span>bijodev1@gmail.com</span>
          </a>
        </div>
        
        <p className="text-sm text-gray-500">
          We appreciate all feedback and ideas to make BibleQZ better for everyone!
        </p>
      </div>
    </div>
  );
};

export default Contact;