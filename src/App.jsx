import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import './App.css';
import { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isTodolistHave, setIsTodlistHave] = useState(false);

  function addTodo(title) {
    const newTodo = { title, id: Date.now(), isCompleted: false };
    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todoList, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  }

  function addisTodolistHave(isTodolistHave) {
    return setIsTodlistHave(!isTodolistHave);
  }
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} addisTodolistHave={addisTodolistHave} />

      {isTodolistHave ? (
        <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
      ) : (
        <p>Add todo above to get started</p>
      )}
    </div>
  );
}

export default App;