import { useState } from 'react';
import SearchBar from './components/SearchBar';
import StatusFilter from './components/StatusFilter';
import TaskTable from './components/TaskTable';
import { useTasks } from './hooks/useTasks';

const PAGE_SIZE = 10;

export default function App() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { tasks, total, loading, error, retry } = useTasks(query, status, page, PAGE_SIZE);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const activeFilterCount = (query ? 1 : 0) + (status ? 1 : 0);

  const handleQueryChange = (value) => {
    setQuery(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const clearFilters = () => {
    setQuery('');
    setStatus('');
    setPage(1);
  };

  const liveMessage = error
    ? 'Could not load tasks.'
    : loading
      ? 'Loading tasks.'
      : `${total} task${total === 1 ? '' : 's'}, page ${page} of ${Math.max(totalPages, 1)}`;

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

      <div className="results-bar">
        <span className="results-count">
          {loading && total === 0 ? 'Loading...' : `${total} task${total === 1 ? '' : 's'}`}
        </span>
        {activeFilterCount > 0 && (
          <span className="results-filters">
            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
            <button type="button" className="link-button" onClick={clearFilters}>
              Clear all
            </button>
          </span>
        )}
      </div>

      <TaskTable
        tasks={tasks}
        loading={loading}
        error={error}
        hasFilters={activeFilterCount > 0}
        onRetry={retry}
        onClearFilters={clearFilters}
      />

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
          <span>
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

      <p className="visually-hidden" role="status" aria-live="polite">
        {liveMessage}
      </p>
    </div>
  );
}
