import { render, screen } from '@testing-library/react';
import { AuthProvider } from './AuthContext';

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(() => () => {}), // never fires — simulates an in-flight auth check
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPhoneNumber: jest.fn(),
  signOut: jest.fn(),
  RecaptchaVerifier: jest.fn(),
}));

jest.mock('../firebase/config', () => ({
  auth: {},
}));

test('renders children immediately without waiting for the auth check to resolve', () => {
  render(
    <AuthProvider>
      <div>child content</div>
    </AuthProvider>
  );

  expect(screen.getByText('child content')).toBeInTheDocument();
});
