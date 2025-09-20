import { useEffect, useState } from 'react';
function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  function preventRefresh(e) {
    e.preventDefault();
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => clearTimeout(debounce);
  }, [localQueryString, setLocalQueryString]);

  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label htmlFor="titleSearch">Search Todos</label>
        <inpust
          type="text"
          id="titleSearch"
          name="title"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <button onClick={(e) => setLocalQueryString('')}>Clear</button>
      </div>
      <label htmlFor="sortBy">Sort By</label>
      <select
        name="sortBy"
        id="sortBy"
        onChange={(e) => setSortField(e.target.value)}
      >
        <option value="title">Title</option>
        <option value="createdTime">Time added</option>
      </select>
      <label htmlFor="sortDirection">Direction</label>
      <select
        name="sortDirection"
        id="sortDirection"
        onChange={(e) => setSortDirection(e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </form>
  );
}

export default TodosViewForm;
