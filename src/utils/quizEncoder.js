// Add unique ID generation
export const generateQuizId = () => {
  return 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Enhanced quiz encoding
export const encodeQuizData = (quizData) => {
  // Add unique ID if not present
  if (!quizData.id) {
    quizData.id = generateQuizId();
  }
  
  const jsonString = JSON.stringify(quizData);
  return btoa(unescape(encodeURIComponent(jsonString)));
};

// Decode remains the same
export const decodeQuizData = (encodedString) => {
  try {
    const jsonString = decodeURIComponent(escape(atob(encodedString)));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decoding quiz data:', error);
    return null;
  }
};

// Validate quiz data structure
export const validateQuizData = (quizData) => {
  if (!quizData || typeof quizData !== 'object') return false;
  if (!quizData.title || !quizData.passage) return false;
  if (!Array.isArray(quizData.questions) || quizData.questions.length === 0) return false;
  
  return quizData.questions.every(question => 
    question.question && 
    Array.isArray(question.options) && 
    question.options.length === 4 &&
    question.options.every(opt => opt.trim() !== '') &&
    typeof question.correctAnswer === 'number' &&
    question.correctAnswer >= 0 &&
    question.correctAnswer <= 3
  );
};

// Results storage functions
export const getStoredQuizResults = (quizId) => {
  try {
    const stored = localStorage.getItem(`bibleq_results_${quizId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving quiz results:', error);
    return [];
  }
};

export const storeQuizResult = (quizId, result) => {
  try {
    const storedResults = getStoredQuizResults(quizId);
    const updatedResults = [...storedResults, result];
    localStorage.setItem(`bibleq_results_${quizId}`, JSON.stringify(updatedResults));
    return true;
  } catch (error) {
    console.error('Error storing quiz result:', error);
    return false;
  }
};

export const clearQuizResults = (quizId) => {
  try {
    localStorage.removeItem(`bibleq_results_${quizId}`);
    return true;
  } catch (error) {
    console.error('Error clearing quiz results:', error);
    return false;
  }
};

// Simple results encoding for manual sharing
export const encodeResultsForSharing = (quizId, result) => {
  try {
    const resultsData = {
      quizId,
      result,
      submittedAt: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(resultsData);
    return btoa(unescape(encodeURIComponent(jsonString)));
  } catch (error) {
    console.error('Error encoding results for sharing:', error);
    return null;
  }
};

export const decodeResultsFromSharing = (encodedString) => {
  try {
    const jsonString = decodeURIComponent(escape(atob(encodedString)));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decoding results from sharing:', error);
    return null;
  }
};

export const importResults = (encodedResults) => {
  try {
    const resultsData = decodeResultsFromSharing(encodedResults);
    if (!resultsData || !resultsData.quizId || !resultsData.result) {
      return false;
    }
    
    return storeQuizResult(resultsData.quizId, resultsData.result);
  } catch (error) {
    console.error('Error importing results:', error);
    return false;
  }
};