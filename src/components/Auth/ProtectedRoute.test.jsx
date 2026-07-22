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
