import styles from './App.module.css';
import { Routes, Route, useLocation } from 'react-router';
import TodosPage from './pages/TodosPage';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Header from './shared/Header';
import './App.css';
import { useState, useReducer, useCallback, useEffect } from 'react';

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const [title, setTitle] = useState('Todo List');
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setTitle('Todo List');
        break;
      case '/about':
        setTitle('About');
        break;
      default:
        setTitle('Not Found');
    }
  }, [location]);

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
  }, [encodeUrl]);

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

  function addisTodolistHave(dispatch) {
    dispatch({
      type: todoActions.setIsTodolistHave,
      value: !todoState.isTodolistHave,
    });
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
    <>
      <Header title={title} />
      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              todoState={todoState}
              dispatch={dispatch}
              todoActions={todoActions}
              addTodo={addTodo}
              updateTodo={updateTodo}
              completeTodo={completeTodo}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
