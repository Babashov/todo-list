import TodoList from './TodoList';
import TodoForm from './TodoForm';
import './App.css';
import { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isTodolistHave, setIsTodlistHave] = useState(false);
  function addTodo(title) {
    const newTodo = { title, id: Date.now() };
    setTodoList([...todoList, newTodo]);
  }

  function addisTodolistHave(isTodolistHave) {
    return setIsTodlistHave(!isTodolistHave);
  }
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} addisTodolistHave={addisTodolistHave} />

      {isTodolistHave ? (
        <TodoList todoList={todoList} />
      ) : (
        <p>Add todo above to get started</p>
      )}
    </div>
  );
}

export default App;
