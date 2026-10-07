export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-field">
      <label htmlFor="task-search" className="visually-hidden">
        Search tasks
      </label>
      <input
        id="task-search"
        type="text"
        className="search-input"
        placeholder="Search tasks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="search-clear"
          aria-label="Clear search"
          onClick={() => onChange('')}
        >
          &times;
        </button>
      )}
    </div>
  );
}
