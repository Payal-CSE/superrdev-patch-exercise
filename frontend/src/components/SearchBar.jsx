import { useState } from 'react';

export default function SearchBar({ value, onChange }) {
  const [mouseFocused, setMouseFocused] = useState(false);

  return (
    <div className="search-field">
      <label htmlFor="task-search" className="visually-hidden">
        Search tasks
      </label>
      <input
        id="task-search"
        type="text"
        className={`search-input${mouseFocused ? ' mouse-focused' : ''}`}
        placeholder="Search tasks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onMouseDown={() => setMouseFocused(true)}
        onKeyDown={(e) => {
          if (e.key === 'Tab') setMouseFocused(false);
        }}
        onBlur={() => setMouseFocused(false)}
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
