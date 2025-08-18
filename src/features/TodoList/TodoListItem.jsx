<<<<<<< HEAD
import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  function handleCancel(e) {
    e.preventDefault();
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(e) {
    e.preventDefault();
    setWorkingTitle(e.target.value);
  }

  function handleUpdate(e) {
    if (!isEditing) return;
    e.preventDefault();
    onUpdateTodo({ ...todo, title: workingTitle });
    setIsEditing(false);
  }

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel onChange={handleEdit} value={workingTitle} />
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleUpdate}>Update</button>
          </>
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
=======
function TodoListItem({ todo, onCompleteTodo }) {
  return (
    <form onChange={() => onCompleteTodo(todo.id)}>
      <input type="checkbox" />
      <li>{todo.title}</li>
    </form>
>>>>>>> 62f3d88 (src/features && src/shared folders created and TodoForm.jsx moved to src/features folder and TodoList.jsx && TodoListItem.jsx files moved to src/features/TodoList folder)
  );
}

export default TodoListItem;
