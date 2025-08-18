<<<<<<< HEAD
import TodoListItem from './TodoListItem';
function TodoList({ todoList, onUpdateTodo, onCompleteTodo }) {
  return (
    <ul>
      {todoList.map((todo) => {
        return (
          !todo.isCompleted && (
            <TodoListItem
              onUpdateTodo={onUpdateTodo}
              onCompleteTodo={onCompleteTodo}
              key={todo.id}
              todo={todo}
            />
          )
        );
      })}
    </ul>
=======
function TodoList() {
  const todos = [
    { id: 1, title: 'review resources' },
    { id: 2, title: 'take notes' },
    { id: 3, title: 'code out app' },
  ];
  return (
    <>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </>
>>>>>>> 62f3d88 (src/features && src/shared folders created and TodoForm.jsx moved to src/features folder and TodoList.jsx && TodoListItem.jsx files moved to src/features/TodoList folder)
  );
}
export default TodoList;