// api.js
// Simulated server request: resolves with raw task data after 1500 ms.

function fetchTasks(shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // shouldFail is only a switch for demonstrating the error path
            if (shouldFail) {
                reject(new Error("Could not load tasks from the server."));
                return;
            }

            resolve([
                { id: 1, title: "Study JavaScript", completed: false },
                { id: 2, title: "Practice DOM", completed: true },
                { id: 3, title: "Read Async Patterns", completed: false }
            ]);
        }, 1500);
    });
}
