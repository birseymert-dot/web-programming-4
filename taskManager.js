// taskManager.js
// Task and TaskManager classes. Nothing here mutates existing state:
// every "change" builds a new object or a new array.

class Task {
    constructor(id, title, completed) {
        // id is read-only and cannot be redefined or deleted
        Object.defineProperty(this, "id", {
            value: id,
            writable: false,
            configurable: false,
            enumerable: true
        });

        this.title = title;
        this.completed = completed;
    }

    // Returns a NEW Task with the completed value flipped; this task is untouched
    toggle() {
        return new Task(this.id, this.title, !this.completed);
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
    }

    // Replace the whole list with a copy of the given array
    setTasks(tasks) {
        this.tasks = [...tasks];
        return this.tasks;
    }

    // New array = old tasks + the new one
    addTask(task) {
        this.tasks = [...this.tasks, task];
        return this.tasks;
    }

    // New array without the task that has this id
    removeTask(taskId) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        return this.tasks;
    }

    // New array where only the matching task is replaced by its toggled copy
    toggleTask(taskId) {
        this.tasks = this.tasks.map((task) =>
            task.id === taskId ? task.toggle() : task
        );
        return this.tasks;
    }
}
