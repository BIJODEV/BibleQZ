import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders children and calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  const button = screen.getByRole('button', { name: 'Click me' });
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('applies primary variant classes by default', () => {
  render(<Button>Primary</Button>);
  const button = screen.getByRole('button', { name: 'Primary' });

  expect(button.className).toContain('bg-brand-blue');
  expect(button.className).toContain('shadow-brand');
});

test('applies secondary variant classes when variant="secondary"', () => {
  render(<Button variant="secondary">Secondary</Button>);
  const button = screen.getByRole('button', { name: 'Secondary' });

  expect(button.className).toContain('border-mist');
  expect(button.className).not.toContain('bg-brand-blue');
});

test('applies accent variant classes when variant="accent"', () => {
  render(<Button variant="accent">Games</Button>);
  const button = screen.getByRole('button', { name: 'Games' });

  expect(button.className).toContain('bg-brand-violet');
});

test('applies outline-inverse variant classes for use on colored backgrounds', () => {
  render(<Button variant="outline-inverse">Explore Games</Button>);
  const button = screen.getByRole('button', { name: 'Explore Games' });

  expect(button.className).toContain('border-white');
  expect(button.className).toContain('text-white');
  expect(button.className).not.toContain('bg-brand-blue');
});

test('renders as a different element when the "as" prop is provided', () => {
  render(<Button as="a" href="/create">Create Quiz</Button>);
  const link = screen.getByRole('link', { name: 'Create Quiz' });

  expect(link.tagName).toBe('A');
  expect(link).toHaveAttribute('href', '/create');
  expect(link.className).toContain('bg-brand-blue');
});
