import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Button from '../components/UI/Button';
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
    <div className="min-h-screen bg-gradient-to-br from-sky-tint-1 to-sky-tint-2 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className={`card text-center rounded-2xl border p-6 md:p-8 ${
          status === 'success' ? 'bg-green-50 border-green-200' : 
          status === 'error' ? 'bg-red-50 border-red-200' : 
          'bg-white border-mist shadow-lg'
        }`}>
          <div className="flex justify-center mb-4 md:mb-6">
            {status === 'success' ? <CheckCircle2 className="w-16 h-16 text-green-500" /> : 
             status === 'error' ? <XCircle className="w-16 h-16 text-red-500" /> : 
             <Loader2 className="w-16 h-16 text-brand-blue animate-spin" />}
          </div>
          
          <h1 className="text-xl md:text-2xl font-heading font-bold text-ink mb-3 md:mb-4">
            {status === 'success' ? 'Results Imported!' : 
             status === 'error' ? 'Import Failed' : 
             'Importing Results...'}
          </h1>
          
          <p className="text-slate-body text-sm md:text-base mb-4 md:mb-6">
            {message}
          </p>

          {resultData && (
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-mist mb-6 text-left shadow-sm">
              <h3 className="font-heading font-semibold text-brand-blue mb-3">Imported Results:</h3>
              <div className="space-y-2 text-sm md:text-base text-slate-body">
                <p><strong className="text-ink font-heading">Name:</strong> {resultData.result.userName}</p>
                <p><strong className="text-ink font-heading">Score:</strong> {resultData.result.score}/{resultData.result.total}</p>
                <p><strong className="text-ink font-heading">Percentage:</strong> {((resultData.result.score / resultData.result.total) * 100).toFixed(1)}%</p>
                <p><strong className="text-ink font-heading">Quiz:</strong> {resultData.result.quizTitle}</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
            <Button as="a" href="/create" variant="primary" className="w-full sm:w-auto px-6 py-2">
              Back to Quiz Creator
            </Button>
            <Button variant="secondary" onClick={() => window.close()} className="w-full sm:w-auto px-6 py-2">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportResults;