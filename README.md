# Assignment 4 - Dynamic Task Dashboard

A task dashboard built with vanilla JavaScript. Tasks are loaded from a
simulated server, rendered with DOM methods, and can be toggled or deleted.
All state updates are immutable.

## File Organization
```
/
├── index.html      Page structure: heading, #loadTasksBtn, #statusMessage, #taskList
├── styles.css      Minimal styling, including the .completed (line-through) look
├── taskManager.js  Task class (read-only id, toggle) and TaskManager class (immutable updates)
├── api.js          fetchTasks(): Promise that resolves the raw data after 1500 ms
├── main.js         DOM + async orchestration: loading, JSON round trip, rendering, events
└── README.md       This file
```

## How to Run
Open `index.html` in a browser and click **Load Tasks**. No server or build
step is needed.

## Implementation Notes
- `Task.id` is defined with `Object.defineProperty` (`writable: false`,
  `configurable: false`), so it cannot be reassigned, redefined or deleted.
  `toggle()` returns a new `Task` and leaves the original untouched.
- `TaskManager` never changes an existing array: `setTasks` copies with the
  spread operator, `addTask` spreads into a new array, `removeTask` uses
  `filter`, and `toggleTask` uses `map`. The result replaces `this.tasks`.
- `main.js` loads tasks with `async/await` inside `try/catch/finally`. The raw
  data goes through `JSON.stringify` and `JSON.parse` before the `Task`
  instances are created.
- Each task is built with `createElement` and `appendChild`: a
  `div.task` containing a `span`, a `Toggle` button and a `Delete` button.
  Completed tasks get the `completed` class (title shown with line-through).
  Events are attached with `addEventListener`; there are no inline handlers.
- To see the error message, call `fetchTasks(true)` in `main.js` (the optional
  argument makes the simulated request fail), or override `fetchTasks` in the
  browser console before clicking the button.

## Challenges Faced
- **Making `id` truly read-only.** A plain `this.id = id` can be overwritten
  later, so the constructor uses `Object.defineProperty`. Assigning to `id` is
  silently ignored in non-strict code, while trying to redefine it throws a
  `TypeError`.
- **Updating state without mutation.** Because tasks must not be mutated,
  every `TaskManager` method builds a new array and `toggle()` builds a new
  `Task`. The consequence is that the UI has to be re-rendered from the
  manager's state after every change.
- **Re-rendering with DOM methods only.** The list is cleared with a
  `removeChild` loop instead of `innerHTML`, and the listeners are re-created
  with the rows each time, using a closure over `task.id` so every button acts
  on the right task, even after earlier tasks were deleted.
- **The JSON round trip.** `JSON.parse` returns plain objects, so they have no
  `toggle()` method and no read-only `id`. They have to be converted back into
  `Task` instances before they go into the `TaskManager`.
- **Script loading.** Plain scripts are used instead of ES modules so the page
  also works when opened directly from the file system. This makes the order
  of the `<script>` tags matter: `taskManager.js`, then `api.js`, then
  `main.js`.
- **Loading state.** The button is disabled while a request is running to avoid
  overlapping requests, and re-enabled in `finally` so the user can retry after
  an error.
