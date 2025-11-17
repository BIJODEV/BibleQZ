import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [activeTab, setActiveTab] = useState('google'); // 'google' or 'phone'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signInWithGoogle, sendOTP, verifyOTP } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!phoneNumber) {
        setError('Please enter your phone number');
        return;
      }

      // Format phone number (add country code if missing)
      let formattedNumber = phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        formattedNumber = `+91${phoneNumber}`; // Default to India, you can make this dynamic
      }

      const result = await sendOTP(formattedNumber);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!otp) {
        setError('Please enter the OTP');
        return;
      }

      await verifyOTP(confirmationResult, otp);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPhoneAuth = () => {
    setOtpSent(false);
    setOtp('');
    setPhoneNumber('');
    setConfirmationResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <div className="bg-bible-gold w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-bible-blue">⛪</span>
          </div>
          
          <h1 className="text-3xl font-bold text-bible-blue mb-2">Welcome to BibleQ</h1>
          <p className="text-gray-600 mb-8">Sign in to create and manage your Bible quizzes</p>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('google')}
              className={`flex-1 py-3 font-medium ${
                activeTab === 'google'
                  ? 'text-bible-blue border-b-2 border-bible-blue'
                  : 'text-gray-500'
              }`}
            >
              Google Sign-In
            </button>
            <button
              onClick={() => setActiveTab('phone')}
              className={`flex-1 py-3 font-medium ${
                activeTab === 'phone'
                  ? 'text-bible-blue border-b-2 border-bible-blue'
                  : 'text-gray-500'
              }`}
            >
              Phone OTP
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Google Sign-In */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <img 
                  src="https://www.google.com/favicon.ico" 
                  alt="Google" 
                  className="w-5 h-5"
                />
                <span className="font-medium text-gray-700">
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </span>
              </button>
              
              <p className="text-sm text-gray-500">
                Secure sign-in with your Google account
              </p>
            </div>
          )}

          {/* Phone OTP */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bible-blue focus:border-bible-blue"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Include country code (e.g., +91 for India)
                    </p>
                  </div>
                  
                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full btn-primary py-3 disabled:bg-gray-400"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-700 text-sm">
                      OTP sent to {phoneNumber}
                    </p>
                  </div>
                  
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP *
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bible-blue focus:border-bible-blue"
                      maxLength={6}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleVerifyOTP}
                      disabled={loading}
                      className="flex-1 btn-primary py-3 disabled:bg-gray-400"
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button
                      onClick={resetPhoneAuth}
                      className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      Back
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy. 
              Your data is secure and will only be used for quiz creation and management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;