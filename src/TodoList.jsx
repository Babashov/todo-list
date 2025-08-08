import TodoListItem from './TodoListItem';
function TodoList({ todoList, onCompleteTodo }) {
  return (
    <ul>
      {todoList.map((todo) => {
        return (
          !todo.isCompleted && (
            <TodoListItem
              onCompleteTodo={onCompleteTodo}
              key={todo.id}
              todo={todo}
            />
          )
        );
      })}
    </ul>
  );
}
export default TodoList;
