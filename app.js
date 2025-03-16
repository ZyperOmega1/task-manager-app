
class Task {
    constructor(title, description, priority, category) {
        this.id = Date.now();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.category = category;
        this.completed = false;
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
        this.updateCategoryFilter();
        this.renderTasks();
        this.showNotification(`New High Priority Task: ${task.title}`, task.priority);
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.updateCategoryFilter();
        this.renderTasks();
    }

    toggleTaskCompletion(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.renderTasks();
        }
    }

    updateCategoryFilter() {
        const categorySelect = document.getElementById('categoryFilter');
        const categories = [...new Set(this.tasks.map(task => task.category))];
        categorySelect.innerHTML = '<option value="">All Categories</option>';
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            categorySelect.appendChild(opt);
        });
    }

    renderTasks() {
        let filteredTasks = [...this.tasks];
        const searchQuery = document.getElementById("search").value.toLowerCase();
        const selectedCategory = document.getElementById("categoryFilter").value;
        const sortOption = document.getElementById("prioritySort").value;

        // Search filter
        if (searchQuery) {
            filteredTasks = filteredTasks.filter(task => 
                task.title.toLowerCase().includes(searchQuery) || 
                task.description.toLowerCase().includes(searchQuery)
            );
        }

        // Category filter
        if (selectedCategory) {
            filteredTasks = filteredTasks.filter(task => task.category === selectedCategory);
        }

        // Priority sort
        if (sortOption === "asc") {
            filteredTasks.sort((a, b) => priorityValue(a.priority) - priorityValue(b.priority));
        } else if (sortOption === "desc") {
            filteredTasks.sort((a, b) => priorityValue(b.priority) - priorityValue(a.priority));
        }

        const taskList = document.getElementById("taskList");
        taskList.innerHTML = "";
        filteredTasks.forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.classList.add("task");
            if (task.completed) taskElement.classList.add("completed");
            taskElement.innerHTML = `
                <h3>${task.title} (${task.priority})</h3>
                <p>${task.description}</p>
                <p>Category: ${task.category}</p>
                <button onclick="taskManager.toggleTaskCompletion(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button onclick="taskManager.deleteTask(${task.id})">Delete</button>
            `;
            taskList.appendChild(taskElement);
        });
    }

    showNotification(message, priority) {
        if (priority === 'High') {
            const notification = document.createElement("div");
            notification.innerText = message;
            notification.style.position = "fixed";
            notification.style.top = "10px";
            notification.style.right = "10px";
            notification.style.background = "red";
            notification.style.color = "white";
            notification.style.padding = "10px";
            notification.style.borderRadius = "5px";
            document.body.appendChild(notification);
            setTimeout(() => document.body.removeChild(notification), 3000);
        }
    }
}

function priorityValue(priority) {
    return { 'Low': 1, 'Medium': 2, 'High': 3 }[priority];
}

const taskManager = new TaskManager();

document.getElementById("taskForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;
    const category = document.getElementById("category").value;

    if (!title || !description) {
        alert("Title and description are required!");
        return;
    }

    const newTask = new Task(title, description, priority, category);
    taskManager.addTask(newTask);
    this.reset();
    applyFilters();
});

function applyFilters() {
    taskManager.renderTasks();
}

document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});
