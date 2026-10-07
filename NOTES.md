# Submission Notes

## Summary of changes

Fixed the highest-value issues found across the task search flow. Backend/query fixes corrected search predicate precedence, escaped SQL wildcard characters, validated request parameters, handled stale requests, reset pagination when filters changed, and removed artificial API latency. Added repository coverage for task filtering.

The frontend now has clearer loading, error, empty, retry, filter, and live-status behavior. The UI received a restrained Slate Ledger visual treatment, improved task metadata scanning, directional priority indicators, text-only assignees, responsive pagination, and a mobile-first expandable task list with no horizontal task-table scrolling. Desktop retains the table representation. Search and status filtering remain keyboard-accessible, with a custom status combobox/listbox and calm mouse-focus styling.

## Intentionally not changed

No backend API contract, data model, or database architecture was changed. The Oracle PL/SQL reference artifact was not made executable locally. Larger architectural, authentication, persistence, scalability, and feature changes were intentionally left out because this was a focused patch exercise with a timebox. Actual handwritten explanations are not included yet; the repository contains only the requested placeholder.

## Biggest remaining risk

The application uses an in-memory H2 database, so data is not durable and production-scale persistence, concurrency, and operational behavior remain unvalidated. Browser verification was performed locally rather than through a full automated end-to-end suite.

## AI/tools used

Used GitHub Copilot in VS Code (Ashna X1) for codebase exploration, debugging suggestions, implementation assistance, and verification planning. Used the VS Code internal browser, terminal commands, Maven tests, Vite builds, and Git for inspection and validation. All changes were reviewed against the source, browser behavior, and test/build results.