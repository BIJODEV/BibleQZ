import React, { useState, useEffect } from 'react';
import { importResults, decodeResultsFromSharing } from '../utils/quizEncoder';

const ImportResults = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const resultsData = decodeResultsFromSharing(hash);
      
      if (resultsData && resultsData.quizId && resultsData.result) {
        setResultData(resultsData);
        
        const success = importResults(hash);
        if (success) {
          setStatus('success');
          setMessage(`Successfully imported results from ${resultsData.result.userName}!`);
        } else {
          setStatus('error');
          setMessage('Failed to import results. Please try again.');
        }
      } else {
        setStatus('error');
        setMessage('Invalid results link. Please check the link and try again.');
      }
    } else {
      setStatus('error');
      setMessage('No results data found in the URL.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className={`card text-center ${
          status === 'success' ? 'bg-green-50 border-green-200' : 
          status === 'error' ? 'bg-red-50 border-red-200' : 
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="text-6xl mb-4">
            {status === 'success' ? '✅' : 
             status === 'error' ? '❌' : '⏳'}
          </div>
          
          <h1 className="text-2xl font-bold text-bible-blue mb-4">
            {status === 'success' ? 'Results Imported!' : 
             status === 'error' ? 'Import Failed' : 
             'Importing Results...'}
          </h1>
          
          <p className="text-gray-600 mb-4">
            {message}
          </p>

          {resultData && (
            <div className="bg-white rounded-lg p-4 mb-4 text-left">
              <h3 className="font-semibold text-bible-blue mb-2">Imported Results:</h3>
              <p><strong>Name:</strong> {resultData.result.userName}</p>
              <p><strong>Score:</strong> {resultData.result.score}/{resultData.result.total}</p>
              <p><strong>Percentage:</strong> {((resultData.result.score / resultData.result.total) * 100).toFixed(1)}%</p>
              <p><strong>Quiz:</strong> {resultData.result.quizTitle}</p>
            </div>
          )}
          
          <div className="flex space-x-2 justify-center">
            <a
              href="/create"
              className="btn-primary"
            >
              Back to Quiz Creator
            </a>
            <button
              onClick={() => window.close()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportResults;