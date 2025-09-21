import styles from './TodoList.module.css';
import TodoListItem from './TodoListItem';
function TodoList({ todoList, onUpdateTodo, onCompleteTodo }) {
  return (
    <ul className={styles.todoList}>
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
  );
}
export default TodoList;
