import { useState } from 'react';

const PRIORITY_LEVELS = { LOW: 1, MEDIUM: 2, HIGH: 3 };
const PRIORITY_LABELS = { LOW: 'Low priority', MEDIUM: 'Medium priority', HIGH: 'High priority' };

function PriorityIndicator({ priority }) {
  const label = PRIORITY_LABELS[priority] || 'No priority';
  const level = (priority || '').toLowerCase();
  return (
    <span className={`priority priority-${level || 'none'}`} title={label}>
      <svg className="priority-mark" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        <path d="M6 1.2 10.8 6 6 10.8 1.2 6Z" />
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
          <li key={task.id} className="task-card" data-priority={task.priority}>
            <button
              type="button"
              className="task-card-summary"
              aria-expanded={expanded}
              aria-controls={detailsId}
              onClick={() => setExpandedId(expanded ? null : task.id)}
            >
              <span className="task-card-title">{task.title}</span>
              <span className="task-card-meta">
                <span className={`status-badge ${task.status.toLowerCase()}`}>{task.status}</span>
                <PriorityIndicator priority={task.priority} />
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
                  <span className="assignee-name">{task.assignee}</span>
                ) : (
                  '\u2014'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <MobileTaskList tasks={tasks} loading={loading} />
    </>
  );
}
