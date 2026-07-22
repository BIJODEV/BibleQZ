import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

test('renders with the given value and placeholder', () => {
  render(<Input value="hello" placeholder="Enter your name" onChange={() => {}} />);
  const input = screen.getByPlaceholderText('Enter your name');

  expect(input).toHaveValue('hello');
});

test('calls onChange when the user types', () => {
  const handleChange = jest.fn();
  render(<Input value="" placeholder="Phone number" onChange={handleChange} />);
  const input = screen.getByPlaceholderText('Phone number');

  fireEvent.change(input, { target: { value: '123' } });

  expect(handleChange).toHaveBeenCalledTimes(1);
});

test('applies the shared border/radius classes', () => {
  render(<Input placeholder="Test" onChange={() => {}} />);
  const input = screen.getByPlaceholderText('Test');

  expect(input.className).toContain('rounded-btn');
  expect(input.className).toContain('border-mist');
});
