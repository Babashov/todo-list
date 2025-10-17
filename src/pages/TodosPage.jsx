import { useSearchParams } from 'react-router';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;

  const filteredTodoList = todoState.todoList.filter((todo) =>
    todo.title?.toLowerCase().includes(todoState.queryString.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

  const currentTodos = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <>
      <TodoForm
        onAddTodo={addTodo}
        isSaving={todoState.isSaving}
        addisTodolistHave={() =>
          dispatch({
            type: todoActions.setIsTodolistHave,
            value: !todoState.isTodolistHave,
          })
        }
      />

      {!todoState.isLoading ? (
        <>
          {todoState.todoList.length === 0 && <p>Add Todo Above</p>}

          <TodoList
            onUpdateTodo={updateTodo}
            todoList={currentTodos}
            onCompleteTodo={completeTodo}
            isSaving={todoState.isSaving}
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

          <div style={{ marginTop: '1rem' }}>
            <button onClick={handlePrevious} disabled={currentPage === 1}>
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => handlePageChange(idx + 1)}
                disabled={currentPage === idx + 1}
                style={{ margin: '0 5px' }}
              >
                {idx + 1}
              </button>
            ))}

            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      ) : (
        <p>Todo list loading...</p>
      )}
    </>
  );
}

export default TodosPage;
