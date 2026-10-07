import { useState } from 'react';

const PRIORITY_LABELS = { LOW: 'Low priority', MEDIUM: 'Medium priority', HIGH: 'High priority' };
const PRIORITY_PATHS = {
  HIGH: 'M2.5 8 6 4.5 9.5 8',
  MEDIUM: 'M2.5 6 9.5 6',
  LOW: 'M2.5 4 6 7.5 9.5 4',
};

function PriorityIndicator({ priority }) {
  const label = PRIORITY_LABELS[priority] || 'No priority';
  const level = (priority || '').toLowerCase();
  const path = PRIORITY_PATHS[priority];
  return (
    <span className={`priority priority-${level || 'none'}`} title={label}>
      <svg className="priority-mark" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        {path ? <path d={path} /> : <circle cx="6" cy="6" r="1.5" />}
      </svg>
      <span className="visually-hidden">{label}</span>
    </span>
  );
}

function MobileTaskList({ tasks, loading }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <ul className={`mobile-task-list${loading ? ' is-loading' : ''}`} aria-busy={loading}>
      {tasks.map((task) => {
        const expanded = expandedId === task.id;
        const detailsId = `task-details-${task.id}`;
        return (
          <li key={task.id} className="task-card">
            <button
              type="button"
              className="task-card-summary"
              aria-expanded={expanded}
              aria-controls={detailsId}
              onClick={() => setExpandedId(expanded ? null : task.id)}
            >
              <span className="task-card-title">
                <PriorityIndicator priority={task.priority} />
                <span className="task-card-title-text">{task.title}</span>
              </span>
              <span className="task-card-meta">
                <span className={`status-badge ${task.status.toLowerCase()}`}>{task.status}</span>
              </span>
              <span className="task-card-chevron" aria-hidden="true">&rsaquo;</span>
            </button>
            <div id={detailsId} className="task-card-details" hidden={!expanded}>
              <p className="task-card-description">{task.description}</p>
              <dl className="task-card-facts">
                <div className="task-fact">
                  <dt>Status</dt>
                  <dd>
                    <span className={`status-badge ${task.status.toLowerCase()}`}>{task.status}</span>
                  </dd>
                </div>
                <div className="task-fact">
                  <dt>Priority</dt>
                  <dd>
                    <PriorityIndicator priority={task.priority} />
                  </dd>
                </div>
                <div className="task-fact">
                  <dt>Assignee</dt>
                  <dd>{task.assignee || '\u2014'}</dd>
                </div>
                <div className="task-fact">
                  <dt>ID</dt>
                  <dd>{task.id}</dd>
                </div>
              </dl>
            </div>
          </li>
        );
      })}
    </ul>
  );
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
    <>
    <div className="table-scroll">
      <table className="task-table" aria-busy={loading}>
        <caption className="visually-hidden">Task search results</caption>
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Status</th>
            <th scope="col">Assignee</th>
            <th scope="col">ID</th>
          </tr>
        </thead>
        <tbody className={loading ? 'is-loading' : undefined}>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <div className="task-title">
                  <PriorityIndicator priority={task.priority} />
                  <span className="task-title-text">{task.title}</span>
                </div>
                <div className="task-desc">{task.description}</div>
              </td>
              <td>
                <span className={`status-badge ${task.status.toLowerCase()}`}>{task.status}</span>
              </td>
              <td>
                {task.assignee ? (
                  <span className="assignee-name">{task.assignee}</span>
                ) : (
                  '\u2014'
                )}
              </td>
              <td className="task-id">{task.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <MobileTaskList tasks={tasks} loading={loading} />
    </>
  );
}
