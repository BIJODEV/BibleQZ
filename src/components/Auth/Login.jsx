import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { Church } from 'lucide-react';

const GoogleIcon = (props) => (
  <svg viewBox="0 0 48 48" width="20" height="20" {...props}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039
      l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
      c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
      c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24
      C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

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
    <div className="min-h-screen bg-gradient-to-br from-sky-tint-1 to-sky-tint-2 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <div className="bg-brand-violet w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Church className="w-9 h-9 text-white" />
          </div>

          <h1 className="text-3xl font-heading font-bold text-ink mb-2">Welcome to BibleQ</h1>
          <p className="text-slate-body mb-8">Sign in to create and manage your Bible quizzes</p>

          {/* Tab Navigation */}
          <div className="flex border-b border-mist mb-6">
            <button
              onClick={() => setActiveTab('google')}
              className={`flex-1 py-3 font-medium ${
                activeTab === 'google'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-body'
              }`}
            >
              Google Sign-In
            </button>
            <button
              onClick={() => setActiveTab('phone')}
              className={`flex-1 py-3 font-medium ${
                activeTab === 'phone'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-body'
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
              <Button
                variant="secondary"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full p-4 disabled:opacity-50"
              >
                <GoogleIcon />
                <span className="font-medium text-ink">
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </span>
              </Button>

              <p className="text-sm text-slate-body">
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
                    <label className="block text-sm font-medium text-ink mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                    <p className="text-xs text-slate-body mt-1">
                      Include country code (e.g., +91 for India)
                    </p>
                  </div>

                  <Button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full py-3 disabled:opacity-50"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-700 text-sm">
                      OTP sent to {phoneNumber}
                    </p>
                  </div>

                  <div className="text-left">
                    <label className="block text-sm font-medium text-ink mb-2">
                      Enter OTP *
                    </label>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={loading}
                      className="flex-1 py-3 disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={resetPhoneAuth}
                      className="px-4 py-3"
                    >
                      Back
                    </Button>
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
