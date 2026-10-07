import { useEffect, useRef, useState } from 'react';

const OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

const LIST_ID = 'status-filter-listbox';

export default function StatusFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  const selectedIndex = Math.max(0, OPTIONS.findIndex((option) => option.value === value));
  const selected = OPTIONS[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  const openMenu = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const commit = (index) => {
    onChange(OPTIONS[index].value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) openMenu();
        else setActiveIndex((index) => Math.min(index + 1, OPTIONS.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) openMenu();
        else setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!open) openMenu();
        else commit(activeIndex);
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      case 'Tab':
        if (open) setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="status-filter" ref={containerRef}>
      <span id="status-filter-label" className="visually-hidden">
        Filter by status
      </span>
      <button
        type="button"
        ref={buttonRef}
        className="status-filter-button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={LIST_ID}
        aria-labelledby="status-filter-label status-filter-value"
        aria-activedescendant={open ? `status-option-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
      >
        <span id="status-filter-value">{selected.label}</span>
        <svg className="status-filter-chevron" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
          <path
            d="M2.5 4.5 6 8 9.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul className="status-filter-menu" id={LIST_ID} role="listbox" aria-labelledby="status-filter-label">
          {OPTIONS.map((option, index) => (
            <li
              key={option.value || 'all'}
              id={`status-option-${index}`}
              className={`status-filter-option${index === activeIndex ? ' is-active' : ''}`}
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => commit(index)}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <svg className="status-filter-check" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
                  <path
                    d="M2.5 6.5 5 9 9.5 3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
