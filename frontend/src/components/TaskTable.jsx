const PRIORITY_LEVELS = { LOW: 1, MEDIUM: 2, HIGH: 3 };
const PRIORITY_LABELS = { LOW: 'Low priority', MEDIUM: 'Medium priority', HIGH: 'High priority' };

function PriorityIndicator({ priority }) {
  const level = PRIORITY_LEVELS[priority] || 0;
  const label = PRIORITY_LABELS[priority] || 'No priority';
  return (
    <span className="priority" title={label}>
      <span className="priority-bars" aria-hidden="true">
        {[1, 2, 3].map((bar) => (
          <span key={bar} className={`priority-bar${bar <= level ? ' active' : ''}`} />
        ))}
      </span>
      <span className="visually-hidden">{label}</span>
    </span>
  );
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function TaskTable({ tasks, loading, error, hasFilters, onRetry, onClearFilters }) {
  if (error) {
    return (
      <div className="state-message error" role="alert">
        <p className="state-title">Couldn&rsquo;t load tasks.</p>
        <p className="state-detail">Something went wrong while fetching the task list.</p>
        <button type="button" className="button-primary" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (!loading && (!tasks || tasks.length === 0)) {
    return (
      <div className="state-message">
        <p className="state-title">
          {hasFilters ? 'No tasks match your current filters.' : 'No tasks found.'}
        </p>
        {hasFilters && (
          <button type="button" className="button-secondary" onClick={onClearFilters}>
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="task-table" aria-busy={loading}>
        <caption className="visually-hidden">Task search results</caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Status</th>
            <th scope="col">Priority</th>
            <th scope="col">Assignee</th>
          </tr>
        </thead>
        <tbody className={loading ? 'is-loading' : undefined}>
          {tasks.map((task) => (
            <tr key={task.id} data-priority={task.priority}>
              <td className="task-id">{task.id}</td>
              <td>
                <div className="task-title">{task.title}</div>
                <div className="task-desc">{task.description}</div>
              </td>
              <td>
                <span className={`status-badge ${task.status.toLowerCase()}`}>{task.status}</span>
              </td>
              <td>
                <PriorityIndicator priority={task.priority} />
              </td>
              <td>
                {task.assignee ? (
                  <span className="assignee">
                    <span className="assignee-avatar" aria-hidden="true">
                      {initials(task.assignee)}
                    </span>
                    <span className="assignee-name">{task.assignee}</span>
                  </span>
                ) : (
                  '\u2014'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
