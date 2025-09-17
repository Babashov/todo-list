function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
}) {
  function preventRefresh(e) {
    e.preventDefault();
  }
  return (
    <form onSubmit={preventRefresh}>
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
