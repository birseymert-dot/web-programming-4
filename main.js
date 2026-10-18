// main.js
// Connects the DOM, the async API and the TaskManager.

// ---------- 1. DOM references and state ----------
const loadTasksBtn = document.getElementById("loadTasksBtn");
const taskList = document.getElementById("taskList");
const statusMessage = document.getElementById("statusMessage");

const taskManager = new TaskManager();

// ---------- 2. Rendering ----------
function renderTasks() {
    // Remove the old rows, then rebuild the list from the manager's tasks
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    taskManager.tasks.forEach((task) => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        if (task.completed) {
            taskDiv.classList.add("completed");
        }

        const titleSpan = document.createElement("span");
        titleSpan.textContent = task.title;

        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "Toggle";
        toggleBtn.setAttribute("aria-label", `Toggle completion for ${task.title}`);
        toggleBtn.addEventListener("click", () => {
            taskManager.toggleTask(task.id);
            renderTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            taskManager.removeTask(task.id);
            renderTasks();
        });

        taskDiv.appendChild(titleSpan);
        taskDiv.appendChild(toggleBtn);
        taskDiv.appendChild(deleteBtn);
        taskList.appendChild(taskDiv);
    });
}

// ---------- 3. Loading tasks (async/await) ----------
async function loadTasks() {
    statusMessage.classList.remove("error");
    statusMessage.textContent = "Loading tasks...";
    loadTasksBtn.disabled = true;

    try {
        const rawTasks = await fetchTasks();

        // JSON requirement: stringify, then parse back, then build Task instances
        const json = JSON.stringify(rawTasks);
        const parsedTasks = JSON.parse(json);
        const tasks = parsedTasks.map(
            (item) => new Task(item.id, item.title, item.completed)
        );

        taskManager.setTasks(tasks);
        renderTasks();
        statusMessage.textContent = "";
    } catch (error) {
        statusMessage.classList.add("error");
        statusMessage.textContent = "Error: " + error.message;
    } finally {
        loadTasksBtn.disabled = false;
    }
}

// ---------- 4. Events ----------
loadTasksBtn.addEventListener("click", loadTasks);
