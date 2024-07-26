import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [Todos, SetTodos] = useState([]);
  const [TaskInput, SetTaskInput] = useState('');
  const [TaskTime, SetTaskTime] = useState('');
  const [EditId, SetEditId] = useState(null);
  const [ValidationMessage, SetValidationMessage] = useState('');

  useEffect(() => {
    const SavedTodos = JSON.parse(localStorage.getItem('Todos'));
    if (SavedTodos) {
      SetTodos(SavedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('Todos', JSON.stringify(Todos));
  }, [Todos]);

  const ToPascalCase = (InputTodoString) => {
    return InputTodoString
      .split(' ')
      .map(InputTask => InputTask.charAt(0).toUpperCase() + InputTask.slice(1).toLowerCase())
      .join(' ');
  };

  const AddTodo = (Event) => {
    Event.preventDefault();

    if (!TaskInput || !TaskTime) {
      SetValidationMessage('Please fill both fields');
      return;
    }

    SetValidationMessage('');

    if (EditId !== null) {
      SetTodos(Todos.map((Todo) =>
        Todo.id === EditId
          ? { ...Todo, Text: ToPascalCase(TaskInput), Time: TaskTime }
          : Todo
      ));
      SetEditId(null);
    } else {
      SetTodos([
        ...Todos,
        { id: Date.now(), Text: ToPascalCase(TaskInput), Completed: false, Time: TaskTime }
      ]);
    }
    SetTaskInput('');
    SetTaskTime('');
  };

  const ToggleTodo = (Id) => {
    SetTodos(Todos.map((Todo) =>
      Todo.id === Id ? { ...Todo, Completed: !Todo.Completed } : Todo
    ));
  };

  const DeleteTodo = (Id) => {
    SetTodos(Todos.filter((Todo) => Todo.id !== Id));
  };

  const EditTodo = (Id) => {
    const TodoToEdit = Todos.find((Todo) => Todo.id === Id);
    SetTaskInput(TodoToEdit.Text);
    SetTaskTime(TodoToEdit.Time || '');
    SetEditId(Id);
  };

  const CalculateRemainingTime = (TaskTime) => {
    if (!TaskTime) return '';
    const CurrentTime = new Date();
    const TaskDateTime = new Date();
    const [Hours, Minutes] = TaskTime.split(':').map(Number);
    TaskDateTime.setHours(Hours, Minutes, 0);

    const DiffMs = TaskDateTime - CurrentTime;
    if (DiffMs <= 0) return 'Time passed';

    const DiffHrs = Math.floor(DiffMs / 1000 / 60 / 60);
    const DiffMins = Math.floor((DiffMs % (1000 * 60 * 60)) / 1000 / 60);
    return `${DiffHrs} hrs ${DiffMins} mins left`;
  };

  return (
    <div className="App">
      <div className="Container">
        <h1>To-Do List <span role="img" aria-label="emoji">📝</span></h1>
        <form onSubmit={AddTodo}>
          <div className="InputContainer">
            <input
              type="text"
              value={TaskInput}
              onChange={(e) => SetTaskInput(e.target.value)}
              placeholder="Add your task"
            />
            <input
              type="time"
              value={TaskTime}
              onChange={(e) => SetTaskTime(e.target.value)}
            />
            <button type="submit">{EditId !== null ? 'Update' : 'Add'}</button>
          </div>
        </form>
        {ValidationMessage && <p className="ValidationMessage">{ValidationMessage}</p>}
        <ul id="TodoList">
          {Todos.map((Todo) => (
            <li key={Todo.id} className={Todo.Completed ? 'Completed' : ''}>
              <div className="TodoText">
                <input
                  type="checkbox"
                  checked={Todo.Completed}
                  onChange={() => ToggleTodo(Todo.id)}  
                />
                <span>{Todo.Text}</span>
                <span className="TodoTime">{CalculateRemainingTime(Todo.Time)}</span>
              </div>
              <div className="TodoActions">
                <button onClick={() => EditTodo(Todo.id)}>✏️</button>
                <button onClick={() => DeleteTodo(Todo.id)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
