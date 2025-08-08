function TodoListItem({ todo, onCompleteTodo }) {
  return (
    <form onChange={() => onCompleteTodo(todo.id)}>
      <input type="checkbox" />
      <li>{todo.title}</li>
    </form>
  );
}

export default TodoListItem;
