import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Create a new quiz in Firestore
export const createQuizInFirestore = async (quizData) => {
  try {
    const quizRef = doc(db, 'quizzes', quizData.id);
    
    await setDoc(quizRef, {
      ...quizData,
      results: [],
      createdAt: new Date(),
      totalParticipants: 0
    });
    
    console.log('Quiz created in Firestore:', quizData.id);
    return true;
  } catch (error) {
    console.error('Error creating quiz in Firestore:', error);
    return false;
  }
};

// Get quiz data from Firestore
export const getQuizFromFirestore = async (quizId) => {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const quizDoc = await getDoc(quizRef);
    
    if (quizDoc.exists()) {
      return quizDoc.data();
    } else {
      console.log('No such quiz found!');
      return null;
    }
  } catch (error) {
    console.error('Error getting quiz:', error);
    return null;
  }
};

// Submit results to Firestore
// Submit results to Firestore with duplicate prevention
export const submitQuizResults = async (quizId, result) => {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const quizDoc = await getDoc(quizRef);
    
    if (!quizDoc.exists()) {
      console.error('Quiz not found');
      return false;
    }

    const quizData = quizDoc.data();
    const existingResults = quizData.results || [];
    
    // Check for existing submission from same user in last 30 seconds
    const recentDuplicate = existingResults.find(existingResult => 
      existingResult.userName === result.userName && 
      new Date(existingResult.timestamp) > new Date(Date.now() - 30000) // 30 seconds
    );

    if (recentDuplicate) {
      console.log('Duplicate submission prevented for user:', result.userName);
      return true; // Return true to avoid showing error to user
    }

    // Add result to the quiz's results array
    await updateDoc(quizRef, {
      results: arrayUnion({
        ...result,
        id: `${result.userName}_${Date.now()}` // Unique ID for each result
      }),
      totalParticipants: (quizData.totalParticipants || 0) + 1,
      lastUpdated: new Date()
    });

    console.log('Results submitted successfully for quiz:', quizId);
    return true;
  } catch (error) {
    console.error('Error submitting results:', error);
    return false;
  }
};

// Listen for real-time results updates
export const listenToQuizResults = (quizId, callback) => {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    
    const unsubscribe = onSnapshot(quizRef, (doc) => {
      if (doc.exists()) {
        const quizData = doc.data();
        callback(quizData.results || []);
      }
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up real-time listener:', error);
    return () => {}; // Return empty function as fallback
  }
};

// Get all quizzes (for future features)
export const getAllQuizzes = async () => {
  try {
    // This would need a different structure for multiple quizzes
    // For now, we're using individual quiz documents
    return [];
  } catch (error) {
    console.error('Error getting quizzes:', error);
    return [];
  }
};

// Save quiz to user's history
export const saveQuizToUserHistory = async (userId, quizData) => {
  try {
    const userQuizRef = doc(db, 'userQuizzes', userId);
    const userDoc = await getDoc(userQuizRef);
    
    if (userDoc.exists()) {
      // Update existing user's quiz history (keep last 5)
      const existingQuizzes = userDoc.data().quizzes || [];
      const updatedQuizzes = [quizData, ...existingQuizzes].slice(0, 5); // Keep last 5
      
      await updateDoc(userQuizRef, {
        quizzes: updatedQuizzes,
        lastUpdated: new Date()
      });
    } else {
      // Create new user quiz history
      await setDoc(userQuizRef, {
        userId,
        quizzes: [quizData],
        createdAt: new Date(),
        lastUpdated: new Date()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error saving quiz to history:', error);
    return false;
  }
};

// Get user's quiz history
export const getUserQuizHistory = async (userId) => {
  try {
    const userQuizRef = doc(db, 'userQuizzes', userId);
    const userDoc = await getDoc(userQuizRef);
    
    if (userDoc.exists()) {
      return userDoc.data().quizzes || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting user quiz history:', error);
    return [];
  }
};

// Get quiz results from Firestore
export const getQuizResultsFromFirestore = async (quizId) => {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const quizDoc = await getDoc(quizRef);
    
    if (quizDoc.exists()) {
      const quizData = quizDoc.data();
      return {
        quiz: {
          title: quizData.title,
          passage: quizData.passage,
          questions: quizData.questions,
          description: quizData.description
        },
        results: quizData.results || [],
        totalParticipants: quizData.totalParticipants || 0,
        createdAt: quizData.createdAt,
        lastUpdated: quizData.lastUpdated
      };
    } else {
      console.log('No such quiz found!');
      return null;
    }
  } catch (error) {
    console.error('Error getting quiz results:', error);
    return null;
  }
};

// Get user's created quizzes with results
export const getUserQuizzesWithResults = async (userId) => {
  try {
    const userQuizRef = doc(db, 'userQuizzes', userId);
    const userDoc = await getDoc(userQuizRef);
    
    if (userDoc.exists()) {
      const userQuizzes = userDoc.data().quizzes || [];
      
      // Fetch results for each quiz
      const quizzesWithResults = await Promise.all(
        userQuizzes.map(async (quiz) => {
          const resultsData = await getQuizResultsFromFirestore(quiz.id);
          return {
            ...quiz,
            results: resultsData?.results || [],
            totalParticipants: resultsData?.totalParticipants || 0,
            lastUpdated: resultsData?.lastUpdated
          };
        })
      );
      
      return quizzesWithResults;
    }
    return [];
  } catch (error) {
    console.error('Error getting user quizzes with results:', error);
    return [];
  }
};