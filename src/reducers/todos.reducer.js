const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  revertTodo: 'revertTodo',
  clearError: 'clearError',
  setSortDirection: 'setSortDirection',
  setSortField: 'setSortField',
  setQueryString: 'setQueryString',
};
const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
  sortField: 'createdTime',
  sortDirection: 'desc',
  queryString: '',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };
    case actions.loadTodos:
      return {
        ...state,
        todoList: action.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          return todo;
        }),
        isLoading: false,
      };
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
        isSaving: false,
      };
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };
    case actions.addTodo:
      const savedTodo = {
        ...action.records,
        isCompleted: false,
      };

      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    case actions.updateTodo: {
      const updatedTodos = state.todoList.map((todo) => {
        if (todo.id === action.editedTodo.id) {
          return { ...action.editedTodo };
        }
        return todo;
      });

      const updatedState = {
        ...state,
        todoList: updatedTodos,
      };

      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }

      return updatedState;
    }

    case actions.completeTodo: {
      const updatedTodos = state.todoList.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, isCompleted: true };
        }
        return todo;
      });

      return {
        ...state,
        todoList: updatedTodos,
      };
    }

    case actions.revertTodo:
      return {
        ...state,
      };
    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };
    case actions.setSortDirection:
      return {
        ...state,
        sortDirection: action.value,
      };
    case actions.setSortField:
      return {
        ...state,
        sortField: action.value,
      };
    case actions.setQueryString:
      return {
        ...state,
        queryString: action.value,
      };
    default:
      return state;
  }
}

export { reducer, actions, initialState };
