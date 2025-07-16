function TodoList() {
  const todos = [
    { id: 1, title: 'review resources' },
    { id: 2, title: 'take notes' },
    { id: 3, title: 'code out app' },
  ];
  return todos.map((todo) => <li key={todo.id}>{todo.title}</li>);
}
export default TodoList;
