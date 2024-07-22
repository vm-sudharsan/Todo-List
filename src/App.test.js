import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Todo List', () => {
  render(<App />);
  const linkElement = screen.getByText(/Todo List/i);
  expect(linkElement).toBeInTheDocument();
});

test('adds a task', () => {
  render(<App />);
  fireEvent.change(screen.getByPlaceholderText(/add a new task/i), { target: { value: 'New Task' } });
  fireEvent.click(screen.getByText(/add task/i));
  expect(screen.getByText(/new task/i)).toBeInTheDocument();
});

test('deletes a task', () => {
  render(<App />);
  fireEvent.change(screen.getByPlaceholderText(/add a new task/i), { target: { value: 'New Task' } });
  fireEvent.click(screen.getByText(/add task/i));
  fireEvent.click(screen.getByText(/delete/i));
  expect(screen.queryByText(/new task/i)).not.toBeInTheDocument();
});

test('toggles a task', () => {
  render(<App />);
  fireEvent.change(screen.getByPlaceholderText(/add a new task/i), { target: { value: 'New Task' } });
  fireEvent.click(screen.getByText(/add task/i));
  fireEvent.click(screen.getByLabelText(/completed/i));
  expect(screen.getByLabelText(/completed/i)).toBeChecked();
});
