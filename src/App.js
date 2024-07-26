import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [editId, setEditId] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const toPascalCase = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const addTodo = (event) => {
    event.preventDefault();

    if (!input || !time) {
      setValidationMessage('Please fill both fields');
      return;
    }

    setValidationMessage('');

    if (editId !== null) {
      setTodos(todos.map((todo) =>
        todo.id === editId
          ? { ...todo, text: toPascalCase(input), time: time }
          : todo
      ));
      setEditId(null);
    } else {
      setTodos([
        ...todos,
        { id: Date.now(), text: toPascalCase(input), completed: false, time: time }
      ]);
    }
    setInput('');
    setTime('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    setInput(todoToEdit.text);
    setTime(todoToEdit.time || '');
    setEditId(id);
  };

  const calculateRemainingTime = (time) => {
    if (!time) return '';
    const currentTime = new Date();
    const taskTime = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    taskTime.setHours(hours, minutes, 60);

    const diffMs = taskTime - currentTime;
    if (diffMs <= 0) return 'Time passed';

    const diffHrs = Math.floor(diffMs / 1000 / 60 / 60);
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / 1000 / 60);
    return diffHrs + " hrs " + diffMins + " mins left";
  };

  return (
    <div className="App">
      <div className="container">
        <h1>To-Do List <span role="img" aria-label="emoji">📝</span></h1>
        <form onSubmit={addTodo}>
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add your task"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <button type="submit">{editId !== null ? 'Update' : 'Add'}</button>
          </div>
        </form>
        {validationMessage && <p className="validation-message">{validationMessage}</p>}
        <ul id="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <div className="todo-text">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}  
                />
                <span>{todo.text}</span>
                <span className="todo-time">{calculateRemainingTime(todo.time)}</span>
              </div>
              <div className="todo-actions">
                <button onClick={() => editTodo(todo.id)}>✏️</button>
                <button onClick={() => deleteTodo(todo.id)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
