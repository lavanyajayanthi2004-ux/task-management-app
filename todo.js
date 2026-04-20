// ====================================
// Task Manager Application with Auth
// ====================================

// ===== AUTHENTICATION STATE =====
let currentUser = null;

// ===== TASK MANAGEMENT STATE =====
let tasks = [];
let currentStatusFilter = 'all';
let selectedPriorities = {
    'High': false,
    'Medium': false,
    'Low': false
};

// ====================================
// AUTHENTICATION FUNCTIONS
// ====================================

// Initialize auth on page load
function initializeAuth() {
    // Check if user is already logged in
    const loggedInUser = localStorage.getItem('currentUser');

    if (loggedInUser) {
        // User is logged in, show task app
        currentUser = loggedInUser;
        showTaskApp();
        loadTasksFromStorage();
        renderTasks();
    } else {
        // User is not logged in, show login page
        showAuthPage();
    }
}

// Switch to signup form
function switchToSignup(event) {
    event.preventDefault();
    document.getElementById('login-section').classList.remove('active');
    document.getElementById('signup-section').classList.add('active');
    document.getElementById('login-error').innerHTML = '';
    document.getElementById('signup-error').innerHTML = '';
}

// Switch to login form
function switchToLogin(event) {
    event.preventDefault();
    document.getElementById('signup-section').classList.remove('active');
    document.getElementById('login-section').classList.add('active');
    document.getElementById('login-error').innerHTML = '';
    document.getElementById('signup-error').innerHTML = '';
}

// Handle user signup
function handleSignup() {
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const errorDiv = document.getElementById('signup-error');

    // Clear previous error
    errorDiv.innerHTML = '';

    // Validation
    if (!username || !password || !confirmPassword) {
        errorDiv.innerHTML = '⚠️ All fields are required!';
        return;
    }

    if (username.length < 3) {
        errorDiv.innerHTML = '⚠️ Username must be at least 3 characters!';
        return;
    }

    if (password.length < 4) {
        errorDiv.innerHTML = '⚠️ Password must be at least 4 characters!';
        return;
    }

    if (password !== confirmPassword) {
        errorDiv.innerHTML = '⚠️ Passwords do not match!';
        return;
    }

    // Get all registered users
    let users = JSON.parse(localStorage.getItem('users')) || {};

    // Check if username already exists
    if (users[username]) {
        errorDiv.innerHTML = '⚠️ Username already exists! Try a different one.';
        return;
    }

    // Register new user
    users[username] = {
        password: password, // In real app, never store plain passwords!
        createdAt: new Date().toISOString()
    };

    localStorage.setItem('users', JSON.stringify(users));

    // Clear form and show success message
    document.getElementById('signup-username').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-confirm-password').value = '';

    errorDiv.style.color = '#10b981';
    errorDiv.innerHTML = '✅ Account created successfully! Please login.';

    // Automatically switch to login after 2 seconds
    setTimeout(() => {
        switchToLogin({ preventDefault: () => { } });
    }, 2000);
}

// Handle user login
function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    // Clear previous error
    errorDiv.innerHTML = '';

    // Validation
    if (!username || !password) {
        errorDiv.innerHTML = '⚠️ Please enter username and password!';
        return;
    }

    // Get registered users
    const users = JSON.parse(localStorage.getItem('users')) || {};

    // Check if user exists and password is correct
    if (!users[username] || users[username].password !== password) {
        errorDiv.innerHTML = '⚠️ Invalid username or password!';
        return;
    }

    // Login successful
    currentUser = username;
    localStorage.setItem('currentUser', username);

    // Clear form
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';

    // Show task app
    showTaskApp();
    loadTasksFromStorage();
    renderTasks();
}

// Handle user logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        tasks = [];

        // Reset filters
        currentStatusFilter = 'all';
        selectedPriorities = {
            'High': false,
            'Medium': false,
            'Low': false
        };

        // Show auth page
        showAuthPage();
    }
}

// Show authentication page
function showAuthPage() {
    document.getElementById('auth-container').classList.remove('auth-active-hidden');
    document.getElementById('app-container').classList.add('app-container-hidden');
    document.getElementById('login-section').classList.add('active');
    document.getElementById('signup-section').classList.remove('active');
}

// Show task management app
function showTaskApp() {
    document.getElementById('auth-container').classList.add('auth-active-hidden');
    document.getElementById('app-container').classList.remove('app-container-hidden');
    document.getElementById('username-display').textContent = `Welcome, ${currentUser}!`;
}

// ====================================
// TASK MANAGEMENT FUNCTIONS
// ====================================

// Get storage key for current user
function getUserStorageKey() {
    return `tasks_${currentUser}`;
}

// Save tasks to localStorage (user-specific)
function saveTasksToStorage() {
    const key = getUserStorageKey();
    localStorage.setItem(key, JSON.stringify(tasks));
}

// Load tasks from localStorage (user-specific)
function loadTasksFromStorage() {
    const key = getUserStorageKey();
    const savedTasks = localStorage.getItem(key);

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        tasks = [];
    }
}

// Add new task
function addTask() {
    const inputBox = document.getElementById('input-box');
    const prioritySelect = document.getElementById('priority-select');
    const dueDateInput = document.getElementById('due-date-input');

    const taskText = inputBox.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    if (taskText === '') {
        alert('Please enter a task description!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        priority: priority,
        dueDate: dueDate,
        completed: false
    };

    tasks.push(newTask);
    saveTasksToStorage();

    inputBox.value = '';
    prioritySelect.value = 'Medium';
    dueDateInput.value = '';

    currentStatusFilter = 'all';
    updateFilterButtons();
    renderTasks();
}

// Toggle task completion
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();
    }
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasksToStorage();
    renderTasks();
}

// Filter tasks by status
function filterTasks(status) {
    currentStatusFilter = status;
    updateFilterButtons();
    renderTasks();
}

// Update filter buttons UI
function updateFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    filterButtons.forEach(btn => {
        if (btn.textContent.toLowerCase() === currentStatusFilter.toLowerCase() ||
            (currentStatusFilter === 'pending' && btn.textContent === 'Pending') ||
            (currentStatusFilter === 'completed' && btn.textContent === 'Completed') ||
            (currentStatusFilter === 'all' && btn.textContent === 'All')) {
            btn.classList.add('active');
        }
    });
}

// Apply priority filters
function applyFilters() {
    selectedPriorities['High'] = document.getElementById('high-filter').checked;
    selectedPriorities['Medium'] = document.getElementById('medium-filter').checked;
    selectedPriorities['Low'] = document.getElementById('low-filter').checked;

    renderTasks();
}

// Get filtered tasks
function getFilteredTasks() {
    let filtered = tasks;

    if (currentStatusFilter === 'pending') {
        filtered = filtered.filter(task => !task.completed);
    } else if (currentStatusFilter === 'completed') {
        filtered = filtered.filter(task => task.completed);
    }

    const anyPrioritySelected = Object.values(selectedPriorities).some(v => v);
    if (anyPrioritySelected) {
        filtered = filtered.filter(task => selectedPriorities[task.priority]);
    }

    return filtered;
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Render tasks on screen
function renderTasks() {
    const listContainer = document.getElementById('list-container');
    const emptyState = document.getElementById('empty-state');

    listContainer.innerHTML = '';

    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        emptyState.classList.add('show');
        return;
    } else {
        emptyState.classList.remove('show');
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');

        if (task.completed) {
            li.classList.add('checked');
        }

        li.innerHTML = `
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-meta">
                    <span class="priority-badge priority-${task.priority.toLowerCase()}">
                        ${task.priority}
                    </span>
                    ${task.dueDate ? `<div class="due-date">📅 Due: ${formatDate(task.dueDate)}</div>` : ''}
                </div>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;

        li.addEventListener('click', function (e) {
            if (!e.target.classList.contains('delete-btn')) {
                toggleTask(task.id);
            }
        });

        listContainer.appendChild(li);
    });
}

// ====================================
// Initialize on Page Load
// ====================================
document.addEventListener('DOMContentLoaded', function () {
    initializeAuth();

    // Add enter key listener for task input
    const inputBox = document.getElementById('input-box');
    if (inputBox) {
        inputBox.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }
});
