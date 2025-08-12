import { useRef } from 'react';

function TodoForm({ onAddTodo, addisTodolistHave }) {
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
      <label htmlFor="todoTitle">Todo</label>
      <input ref={todoTitleInput} name="title" type="text" id="todoTitle" />
      <button>Add Todo</button>
    </form>
  );
}
export default TodoForm;
