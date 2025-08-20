import { useRef } from 'react';
import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo, addisTodolistHave, isSaving }) {
  const todoTitleInput = useRef('');
  const [title, setTitle] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo(title);
    addisTodolistHave();
    setTitle('');
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        label="Todo"
        onChange={(e) => setTitle(e.target.value)}
        inputRef={todoTitleInput}
        value={title}
      />
      <button>{isSaving ? 'Saving...' : 'Add Todo'}</button>
    </form>
  );
}
export default TodoForm;
