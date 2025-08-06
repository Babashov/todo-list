import TodoList from './TodoList';
import TodoForm from './TodoForm';
import './App.css';
import { useState } from 'react';

function App() {
  const [newTodo, setNewTodo] = useState('Exmaple Text');
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <p>{newTodo}</p>
      <TodoList />
    </div>
  );
}

export default App;