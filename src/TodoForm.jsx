import { useRef, useState } from 'react';

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');
  const [title, setTitle] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();
    const newTitle = setTitle(event.target.title.value);
    onAddTodo(newTitle);
    event.target.title.value = '';
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input ref={todoTitleInput} name="title" type="text" id="todoTitle" />
      <button>Add Todo</button>
    </form>
  );
}
export default TodoForm;
