import styles from './App.module.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import './App.css';
import { useState, useReducer, useCallback, useEffect } from 'react';

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const [isTodolistHave, setIsTodlistHave] = useState(false);

  const [queryString, setQueryString] = useState('');

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${
    import.meta.env.VITE_TABLE_NAME
  }`;

  const encodeUrl = useCallback(() => {
    let searchQuery = '';
    if (todoState.queryString) {
      searchQuery = `&filterByFormula=SEARCH("${todoState.queryString}",+title)`;
    }
    let sortQuery = `sort[0][field]=${todoState.sortField}&sort[0][direction]=${todoState.sortDirection}`;
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [todoState.sortField, todoState.sortDirection, todoState.queryString]);

  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async function () {
      dispatch({ type: todoActions.fetchTodos });
      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };
      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw new Error('Failed fetching data from api');
        }
        const { records } = await resp.json();
        dispatch({
          type: todoActions.loadTodos,
          records,
        });
      } catch (err) {
        dispatch({
          type: todoActions.setLoadError,
          error: err,
        });
      } finally {
        dispatch({ type: todoActions.endRequest });
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (title) => {
    const newTodo = { title, isCompleted: false, id: Date.now() };
    dispatch({ type: todoActions.startRequest });

    dispatch({
      type: todoActions.addTodo,
      records: newTodo,
    });

    const payload = {
      records: [
        {
          fields: {
            title,
            isCompleted: false,
          },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error('Fetched data from remote url is not possible');
      }
    } catch (err) {
      dispatch({
        type: todoActions.setLoadError,
        error: err,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const completeTodo = async (id) => {
    dispatch({ type: todoActions.startRequest });

    const checkedTodo = todoState.todoList.find((t) => t.id == id);

    const payload = {
      records: [
        {
          id: checkedTodo.id,
          fields: {
            title: checkedTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error('Fetched data from remote url is not possible');
      }
      dispatch({
        type: todoActions.completeTodo,
        id: id,
      });
    } catch (err) {
      const originalTodo = todoState.todoList.find((t) => t.id === id);
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error: err,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  function addisTodolistHave(isTodolistHave) {
    return setIsTodlistHave(!isTodolistHave);
  }

  const updateTodo = async (editedTodo) => {
    dispatch({ type: todoActions.startRequest });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error('Fetched data from remote url is not possible');
      }
      dispatch({
        type: todoActions.updateTodo,
        editedTodo,
      });
    } catch (err) {
      const originalTodo = todoState.todoList.find(
        (t) => t.id === editedTodo.id
      );
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error: err,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  return (
    <div className={styles.container}>
      <h1>My Todos</h1>
      <img src="/ctd-learns-light.png" />
      <TodoForm
        onAddTodo={addTodo}
        addisTodolistHave={addisTodolistHave}
        isSaving={todoState.isSaving}
      />
      {!todoState.isLoading ? (
        <>
          {todoState.todoList.length === 0 && <p>Add Todo Above</p>}
          <TodoList
            onUpdateTodo={updateTodo}
            todoList={todoState.todoList}
            onCompleteTodo={completeTodo}
            isSaving={todoState.isSaving}
          />
          <hr />
          <TodosViewForm
            sortDirection={todoState.errorMessagesortDirection}
            setSortDirection={todoState.setSortDirection}
            sortField={todoState.sortField}
            setSortField={todoState.setSortField}
            queryString={todoState.queryString}
            setQueryString={setQueryString}
          />
          {todoState.errorMessage && (
            <>
              <hr />
              <div className={styles.errorMsg}>
                <p>{todoState.errorMessage}</p>
              </div>
              <button
                onClick={(e) => dispatch({ type: todoActions.clearError })}
              >
                Dismiss
              </button>
            </>
          )}
        </>
      ) : (
        <p>Todo list loading...</p>
      )}
    </div>
  );
}

export default App;
