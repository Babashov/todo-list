import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isTodolistHave, setIsTodlistHave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async function () {
      setIsLoading(true);
      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };
      try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
          throw new Error('Failed fetching data from api');
        }
        const { records } = await resp.json();
        setTodoList(
          records.map((record) => {
            const todo = {
              id: record.id,
              ...record.fields,
            };
            if (!todo.isCompleted) {
              todo.isCompleted = false;
            }
            return todo;
          })
        );
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (title) => {
    const newTodo = { title, isCompleted: false, id: Date.now() };
    setTodoList([...todoList, newTodo]);

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
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error('Fetched data from remote url is not possible');
      }
      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList([...todoList, savedTodo]);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  }

  function addisTodolistHave(isTodolistHave) {
    return setIsTodlistHave(!isTodolistHave);
  }

  const updateTodo = async (editedTodo) => {
    setIsSaving(true);
    const prevTodos = todoList;
    const originalTodo = prevTodos.find((t) => t.id === editedTodo.id);
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      }
      return todo;
    });

    setTodoList(updatedTodos);

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
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error('Fetched data from remote url is not possible');
      }
    } catch (err) {
      setErrorMessage(err.message);
      const revertedTodos = prevTodos.map((t) =>
        t.id === originalTodo.id ? originalTodo : t
      );
      setTodoList([revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm
        onAddTodo={addTodo}
        addisTodolistHave={addisTodolistHave}
        isSaving={isSaving}
      />

      {!isLoading ? (
        <>
          {todoList.length === 0 && <p>Add Todo Above</p>}
          <TodoList
            onUpdateTodo={updateTodo}
            todoList={todoList}
            onCompleteTodo={completeTodo}
            isSaving={isSaving}
          />
          {errorMessage && (
            <>
              <hr />
              <p>{errorMessage}</p>
              <button onClick={(e) => setErrorMessage('')}>Dismiss</button>
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
