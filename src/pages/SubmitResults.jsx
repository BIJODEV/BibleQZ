// import React, { useState, useEffect } from 'react';
// import { processSubmittedResults } from '../utils/quizEncoder';

// const SubmitResults = () => {
//   const [status, setStatus] = useState('processing');
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const hash = window.location.hash.substring(1);
//     if (hash) {
//       const success = processSubmittedResults(hash);
      
//       if (success) {
//         setStatus('success');
//         setMessage('Results submitted successfully! You can close this window.');
//       } else {
//         setStatus('error');
//         setMessage('Failed to submit results. Please try again or contact the quiz creator.');
//       }
//     } else {
//       setStatus('error');
//       setMessage('No results data found in the URL.');
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         <div className={`card text-center ${
//           status === 'success' ? 'bg-green-50 border-green-200' : 
//           status === 'error' ? 'bg-red-50 border-red-200' : 
//           'bg-blue-50 border-blue-200'
//         }`}>
//           <div className="text-6xl mb-4">
//             {status === 'success' ? '✅' : 
//              status === 'error' ? '❌' : '⏳'}
//           </div>
          
//           <h1 className="text-2xl font-bold text-bible-blue mb-4">
//             {status === 'success' ? 'Submission Successful' : 
//              status === 'error' ? 'Submission Failed' : 
//              'Processing Results...'}
//           </h1>
          
//           <p className="text-gray-600 mb-6">
//             {message}
//           </p>
          
//           {status !== 'processing' && (
//             <button
//               onClick={() => window.close()}
//               className="btn-primary"
//             >
//               Close Window
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmitResults;