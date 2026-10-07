import { useState } from 'react';
import SearchBar from './components/SearchBar';
import StatusFilter from './components/StatusFilter';
import TaskTable from './components/TaskTable';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { tasks, total, loading, error } = useTasks(query, status, page, 10);

  const totalPages = Math.ceil(total / 10);

  const handleQueryChange = (value) => {
    setQuery(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Tracker</h1>
        <p className="subtitle">Internal task management</p>
      </header>

      <div className="controls">
        <SearchBar value={query} onChange={handleQueryChange} />
        <StatusFilter value={status} onChange={handleStatusChange} />
      </div>

      <TaskTable tasks={tasks} loading={loading} error={error} />

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Task results pagination">
          <button
            type="button"
            disabled={page <= 1}
            aria-label="Previous page"
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span aria-live="polite">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            aria-label="Next page"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
