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
