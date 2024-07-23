import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      if (editId !== null) {
        const updatedTodos = todos.map((todo) =>
          todo.id === editId ? { ...todo, text: input, time: time } : todo
        );
        setTodos(updatedTodos);
        setEditId(null);
      } else {
        setTodos([...todos, { id: uuidv4(), text: input, completed: false, time: time }]);
      }
      setInput('');
      setTime('');
    }
  };

  const toggleTodo = (id) => {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
  };

  const editTodo = (id) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    setInput(todoToEdit.text);
    setTime(todoToEdit.time || '');
    setEditId(id);
  };

  const calculateRemainingTime = (time) => {
    if (!time) return '';
    const currentTime = new Date();
    const taskTime = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    taskTime.setHours(hours, minutes, 0);

    const diffMs = taskTime - currentTime;
    if (diffMs <= 0) return 'Time passed';

    const diffHrs = Math.floor(diffMs / 1000 / 60 / 60);
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / 1000 / 60);

    return `${diffHrs} hrs ${diffMins} mins left`;
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <form onSubmit={addTodo}>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <button type="submit">{editId !== null ? 'Update' : 'Add'}</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span>{todo.text}</span>
            {todo.time && <span className="time">Time: {todo.time}</span>}
            <span className="remaining-time">{calculateRemainingTime(todo.time)}</span>
            <div className="todo-actions">
              <button onClick={() => toggleTodo(todo.id)}>
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
              <button onClick={() => editTodo(todo.id)}>Edit</button>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
