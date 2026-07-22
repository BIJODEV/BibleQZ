# UI Makeover Phase 2: Login/Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle `Login.jsx` and `ProtectedRoute.jsx` with the "Modern Sky" design system already shipped in Phase 1 (tokens, `Button`/`Input` primitives, `lucide-react` icons), plus replace the Google sign-in button's `favicon.ico` hack with a real inline Google "G" logomark.

**Architecture:** Both files are visual-only restyles — no behavior change. Unlike Phase 1's `Header`/`Footer`/`Home` (which import `Link` from `react-router-dom` and therefore can't have Jest tests in this repo), neither `Login.jsx` nor `ProtectedRoute.jsx` imports `react-router-dom` at all, so **this phase can have real Jest/RTL tests**. Because behavior is unchanged, the tests in this plan follow a characterization-testing shape rather than pure TDD red-green: write the test against the *current* file, run it and confirm it **passes** (establishing a regression safety net against the current, pre-restyle behavior), do the restyle, then re-run and confirm it **still passes** (proving the restyle didn't change behavior). This is intentional — there is no "red" step here because the task is a refactor, not new functionality.

**Tech Stack:** React 19, Tailwind CSS, `lucide-react`, `Button`/`Input` from Phase 1, Jest + React Testing Library.

## Global Constraints

- No behavior change in either file: same state variables, same handler logic (`handleGoogleSignIn`, `handleSendOTP`, `handleVerifyOTP`, `resetPhoneAuth` in `Login.jsx`; same `loading`/`user` branching in `ProtectedRoute.jsx`), same validation messages, same phone-number formatting (`+91` default prefix when no `+` given).
- Error/success status boxes (`bg-red-50`/`border-red-200`/`text-red-700`, `bg-green-50`/`border-green-200`/`text-green-700`) and the privacy-notice box (`bg-gray-50`/`text-gray-500`) stay as Tailwind defaults — semantic/neutral colors are intentionally exempt from this migration (see design doc's Phase 2 addendum).
- Use these Tailwind tokens from Phase 1: `brand-blue`, `brand-violet`, `ink`, `slate-body`, `mist`, `sky-tint-1`, `sky-tint-2`, `font-heading`, `rounded-btn` (via `Button`/`Input`).
- Use `Church` from `lucide-react` for the icon badge (same pattern as Header/Footer/Home — violet circle, white church icon).
- The Google sign-in icon becomes a local inline `GoogleIcon` SVG component defined in `Login.jsx` itself (single consumer — no new shared file needed).
- Tab buttons (`Google Sign-In` / `Phone OTP`) stay plain native `<button>` elements with conditional className, NOT the `Button` primitive — `Button`'s filled/outlined CTA visual language doesn't fit a segmented tab control. This is a deliberate scope boundary, not an inconsistency.
- `Button`'s own base classes have no padding/text-size baked in (Phase 1 constraint) — every `<Button>` usage in this phase must supply its own via `className`.

---

### Task 1: Restyle Login.jsx

**Files:**
- Modify: `src/components/Auth/Login.jsx`
- Create: `src/components/Auth/Login.test.jsx`

**Interfaces:**
- Consumes: `Button`, `Input` from `src/components/UI/` (Phase 1); `Church` from `lucide-react`; `useAuth()` from `src/contexts/AuthContext.jsx` (unchanged — `signInWithGoogle`, `sendOTP`, `verifyOTP`).
- Produces: no new interface — same default export, same props (none), same internal state/handlers.

- [ ] **Step 1: Write the characterization tests against the current file**

Create `src/components/Auth/Login.test.jsx`:

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockAuth = (overrides = {}) => {
  useAuth.mockReturnValue({
    signInWithGoogle: jest.fn().mockResolvedValue({}),
    sendOTP: jest.fn().mockResolvedValue({}),
    verifyOTP: jest.fn().mockResolvedValue({}),
    ...overrides,
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders the Google Sign-In tab as active by default', () => {
  mockAuth();
  render(<Login />);

  expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
});

test('calls signInWithGoogle when the Google button is clicked', async () => {
  const signInWithGoogle = jest.fn().mockResolvedValue({});
  mockAuth({ signInWithGoogle });
  render(<Login />);

  fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));

  await waitFor(() => expect(signInWithGoogle).toHaveBeenCalledTimes(1));
});

test('switches to the Phone OTP tab and shows a validation error when submitting without a phone number', () => {
  mockAuth();
  render(<Login />);

  fireEvent.click(screen.getByRole('button', { name: /phone otp/i }));
  fireEvent.click(screen.getByRole('button', { name: /send otp/i }));

  expect(screen.getByText(/please enter your phone number/i)).toBeInTheDocument();
});

test('sends a formatted OTP request when a phone number is entered', async () => {
  const sendOTP = jest.fn().mockResolvedValue({ confirm: jest.fn() });
  mockAuth({ sendOTP });
  render(<Login />);

  fireEvent.click(screen.getByRole('button', { name: /phone otp/i }));
  fireEvent.change(screen.getByPlaceholderText(/enter your phone number/i), {
    target: { value: '9876543210' },
  });
  fireEvent.click(screen.getByRole('button', { name: /send otp/i }));

  await waitFor(() => expect(sendOTP).toHaveBeenCalledWith('+919876543210'));
});
```

- [ ] **Step 2: Run the tests against the current (pre-restyle) file to establish the baseline**

Run: `CI=true npx react-scripts test src/components/Auth/Login.test.jsx --watchAll=false`
Expected: PASS (4 tests) — this confirms the tests correctly describe the *current* behavior before any styling changes. This is the safety net, not a "red" step; nothing should fail here.

- [ ] **Step 3: Replace `src/components/Auth/Login.jsx`**

Replace the entire file with:

```jsx
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
```

- [ ] **Step 4: Run the tests again to confirm the restyle didn't change behavior**

Run: `CI=true npx react-scripts test src/components/Auth/Login.test.jsx --watchAll=false`
Expected: PASS (4 tests) — same result as Step 2, proving the visual restyle preserved all tested behavior.

- [ ] **Step 5: Manually verify in dev mode**

Run: `npm start`, navigate to a route that renders `Login` while logged out (e.g. `/create`).
Expected: violet church-icon badge, "Welcome to BibleQ" in Poppins, sky-tint gradient background, tab underline in brand blue when active. Click the Google tab's button — it should show a real multi-color Google "G" logomark (not a browser favicon), and clicking it should trigger the (mocked-in-dev, real in production) Google sign-in flow. Switch to the Phone OTP tab, verify the input and buttons render with the new rounded/bordered style, submit without a number to see the validation error, then enter a number and confirm the "Send OTP" flow still works end to end (or fails gracefully if Firebase phone auth isn't configured in your local environment — that's a pre-existing environment concern, not something this task changes).

- [ ] **Step 6: Commit**

```bash
git add src/components/Auth/Login.jsx src/components/Auth/Login.test.jsx
git commit -m "Restyle Login with Modern Sky design system and real Google icon"
```

---

### Task 2: Restyle ProtectedRoute

**Files:**
- Modify: `src/components/Auth/ProtectedRoute.jsx`
- Create: `src/components/Auth/ProtectedRoute.test.jsx`

**Interfaces:**
- Consumes: `useAuth()` from `src/contexts/AuthContext.jsx` (unchanged); `Login` from `./Login.jsx` (Task 1 — restyled, but `ProtectedRoute` only cares that it renders when there's no user, not its internals).
- Produces: no new interface — same default export, same `children` prop, same loading/no-user/authenticated branching.

- [ ] **Step 1: Write the characterization tests against the current file**

Create `src/components/Auth/ProtectedRoute.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('./Login', () => () => <div>Login screen</div>);

test('shows a loading spinner while auth state is resolving', () => {
  useAuth.mockReturnValue({ user: null, loading: true });
  render(<ProtectedRoute>protected content</ProtectedRoute>);

  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(screen.queryByText('protected content')).not.toBeInTheDocument();
});

test('renders the Login screen when there is no user', () => {
  useAuth.mockReturnValue({ user: null, loading: false });
  render(<ProtectedRoute>protected content</ProtectedRoute>);

  expect(screen.getByText('Login screen')).toBeInTheDocument();
});

test('renders children when a user is present', () => {
  useAuth.mockReturnValue({ user: { uid: '123' }, loading: false });
  render(<ProtectedRoute>protected content</ProtectedRoute>);

  expect(screen.getByText('protected content')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests against the current (pre-restyle) file to establish the baseline**

Run: `CI=true npx react-scripts test src/components/Auth/ProtectedRoute.test.jsx --watchAll=false`
Expected: PASS (3 tests) — safety net, not a "red" step.

- [ ] **Step 3: Replace `src/components/Auth/ProtectedRoute.jsx`**

Replace the entire file with:

```jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Login from './Login';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-tint-1 to-sky-tint-2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
          <p className="text-slate-body mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return children;
};

export default ProtectedRoute;
```

- [ ] **Step 4: Run the tests again to confirm the restyle didn't change behavior**

Run: `CI=true npx react-scripts test src/components/Auth/ProtectedRoute.test.jsx --watchAll=false`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/Auth/ProtectedRoute.jsx src/components/Auth/ProtectedRoute.test.jsx
git commit -m "Restyle ProtectedRoute loading state with Modern Sky tokens"
```
