import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';

function TodosPage({
  todoState,
  dispatch,
  todoActions,
  addTodo,
  completeTodo,
  updateTodo,
  addisTodolistHave,
}) {
  return (
    <>
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

      {!todoState.isLoading ? (
        <>
          {todoState.todoList.length === 0 && <p>Add Todo Above</p>}

          <TodoList
            onUpdateTodo={updateTodo}
            todoList={todoState.todoList}
            onCompleteTodo={completeTodo}
            isSaving={todoState.isSaving}
            addisTodolistHave={addisTodolistHave}
          />

          <hr />

          <TodosViewForm
            sortDirection={todoState.sortDirection}
            setSortDirection={(v) =>
              dispatch({ type: todoActions.setSortDirection, value: v })
            }
            sortField={todoState.sortField}
            setSortField={(v) =>
              dispatch({ type: todoActions.setSortField, value: v })
            }
            queryString={todoState.queryString}
            setQueryString={(v) =>
              dispatch({ type: todoActions.setQueryString, value: v })
            }
          />
        </>
      ) : (
        <p>Todo list loading...</p>
      )}
    </>
  );
}

export default TodosPage;
