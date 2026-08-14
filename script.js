/* =========================
   TASK MANAGEMENT APP
========================= */

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");

const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const filterButtons = document.querySelectorAll(".filter-btn");

const themeToggle = document.getElementById("themeToggle");


let tasks = [];

let currentFilter = "all";


/* =========================
   LOAD SAVED TASKS
========================= */

const savedTasks = localStorage.getItem("taskFlowTasks");

if (savedTasks) {

    tasks = JSON.parse(savedTasks);

}


/* =========================
   SAVE TASKS
========================= */

function saveTasks() {

    localStorage.setItem(
        "taskFlowTasks",
        JSON.stringify(tasks)
    );

}


/* =========================
   ADD TASK
========================= */

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const title = taskInput.value.trim();

    const priority = priorityInput.value;


    if (title === "") {

        taskInput.focus();

        return;

    }


 const newTask = {

    id: Date.now(),

    title: title,

    priority: priority,

    dueDate: dueDateInput.value,

    completed: false,

    createdAt: new Date().toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    )

};
    tasks.unshift(newTask);


    saveTasks();

    renderTasks();


    taskInput.value = "";

    priorityInput.value = "medium";
    dueDateInput.value = "";

    taskInput.focus();

});


/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

    const searchTerm =
        searchInput.value.toLowerCase().trim();


    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm);


        let matchesFilter = true;


        if (currentFilter === "active") {

            matchesFilter = !task.completed;

        }


        if (currentFilter === "completed") {

            matchesFilter = task.completed;

        }


        return matchesSearch && matchesFilter;

    });


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        taskList.appendChild(emptyState);

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";


        filteredTasks.forEach(task => {

            const taskElement =
                createTaskElement(task);

            taskList.appendChild(taskElement);

        });

    }


    updateTaskCount();

}


/* =========================
   CREATE TASK ELEMENT
========================= */

function createTaskElement(task) {

    const taskItem =
        document.createElement("div");


    taskItem.className =
        "task-item";


    if (task.completed) {

        taskItem.classList.add("completed");

    }


    taskItem.innerHTML = `

        <input
            type="checkbox"
            class="task-checkbox"
            ${task.completed ? "checked" : ""}
            aria-label="Mark task as completed"
        >


        <div class="task-content">

            <div class="task-title">
                ${escapeHTML(task.title)}
            </div>


     <div class="task-meta">

    <span class="priority priority-${task.priority}">
        ${capitalize(task.priority)} Priority
    </span>

    <span>
        Added ${task.createdAt}
    </span>

    ${
        task.dueDate
        ? `<span>📅 Due ${formatDueDate(task.dueDate)}</span>`
        : ""
    }

    ${
        isOverdue(task)
        ? `<span class="overdue-badge">⚠️ Overdue</span>`
        : ""
    }

</div>
        </div>


        <div class="task-actions">

            <button
                class="task-action edit-task"
                title="Edit task"
            >
                ✏️
            </button>


            <button
                class="task-action delete-task"
                title="Delete task"
            >
                🗑️
            </button>

        </div>

    `;


    const checkbox =
        taskItem.querySelector(".task-checkbox");


    const editButton =
        taskItem.querySelector(".edit-task");


    const deleteButton =
        taskItem.querySelector(".delete-task");


    /* Complete task */

    checkbox.addEventListener("change", () => {

        task.completed = checkbox.checked;

        saveTasks();

        renderTasks();

    });


    /* Edit task */

    editButton.addEventListener("click", () => {

        const updatedTitle =
            prompt(
                "Edit your task:",
                task.title
            );


        if (
            updatedTitle !== null &&
            updatedTitle.trim() !== ""
        ) {

            task.title =
                updatedTitle.trim();

            saveTasks();

            renderTasks();

        }

    });


    /* Delete task */

    deleteButton.addEventListener("click", () => {

        const confirmed =
            confirm(
                "Are you sure you want to delete this task?"
            );


        if (!confirmed) return;


        tasks =
            tasks.filter(
                item => item.id !== task.id
            );


        saveTasks();

        renderTasks();

    });


    return taskItem;

}


/* =========================
   UPDATE TASK COUNT
========================= */

function updateTaskCount() {

    const activeTasks =
        tasks.filter(
            task => !task.completed
        ).length;


    taskCount.textContent =
        activeTasks;

}


/* =========================
   FILTER TASKS
========================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        currentFilter =
            button.dataset.filter;


        renderTasks();

    });

});


/* =========================
   SEARCH TASKS
========================= */

searchInput.addEventListener(
    "input",
    renderTasks
);


/* =========================
   DARK MODE
========================= */

function updateThemeButton() {

    if (
        document.body.classList.contains(
            "dark-mode"
        )
    ) {

        themeToggle.textContent = "☀️";

        themeToggle.title =
            "Switch to light mode";

    } else {

        themeToggle.textContent = "🌙";

        themeToggle.title =
            "Switch to dark mode";

    }

}


/* Load saved theme */

const savedTheme =
    localStorage.getItem(
        "taskFlowTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-mode"
    );

}


updateThemeButton();


/* Change theme */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle(
        "dark-mode"
    );


    if (
        document.body.classList.contains(
            "dark-mode"
        )
    ) {

        localStorage.setItem(
            "taskFlowTheme",
            "dark"
        );

    } else {

        localStorage.setItem(
            "taskFlowTheme",
            "light"
        );

    }


    updateThemeButton();

});


/* =========================
   SECURITY HELPER
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================
   CAPITALIZE TEXT
========================= */

function capitalize(text) {

    return text.charAt(0).toUpperCase()
        + text.slice(1);

}

/* =========================
   FORMAT DUE DATE
========================= */

function formatDueDate(date) {

    const parts = date.split("-");

    const formattedDate = new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
    );

    return formattedDate.toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================
   INITIAL RENDER
========================= */

renderTasks();

/* =========================
   OVERDUE CHECK
========================= */

function isOverdue(task) {

    if (!task.dueDate || task.completed) {
        return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const parts = task.dueDate.split("-");

    const dueDate = new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
    );

    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
}
