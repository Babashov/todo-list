import styled from 'styled-components';
import { useRef } from 'react';
import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

const StyledButton = styled.button`
  background: blue;
  color: white;
  padding: 5px 10px;
  border: 1px solid gray;
  border-radius: 5px;
  &:disabled {
    font-style: italic;
  }
`;

function TodoForm({ onAddTodo, addisTodolistHave, isSaving }) {
  const todoTitleInput = useRef('');
  const [title, setTitle] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo(title);
    addisTodolistHave();
    setTitle('');
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        label="Todo"
        onChange={(e) => setTitle(e.target.value)}
        inputRef={todoTitleInput}
        value={title}
      />
      <StyledButton>{isSaving ? 'Saving...' : 'Add Todo'}</StyledButton>
    </form>
  );
}
export default TodoForm;
