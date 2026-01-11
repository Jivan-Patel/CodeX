// Goal JavaScript
// All data stored in localStorage

var appData = {
    transactions: [],
    goals: [],
    settings: {}
};

// Load data from localStorage
function loadData() {
    var saved = localStorage.getItem('financeAI_data');
    if (saved) {
        appData = JSON.parse(saved);
    }
    renderGoals();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('financeAI_data', JSON.stringify(appData));
}

// Format number with commas
function formatNumber(num) {
    return num.toLocaleString('en-IN');
}

// Render goals
function renderGoals() {
    var container = document.getElementById('goals-grid');
    container.innerHTML = '';

    for (var i = 0; i < appData.goals.length; i++) {
        var goal = appData.goals[i];
        var percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));
        var remaining = goal.target - goal.saved;
        var daysLeft = Math.max(0, Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)));

        // Calculate SVG circle stroke
        var radius = 52;
        var circumference = 2 * Math.PI * radius;
        var offset = circumference - (percent / 100) * circumference;

        var html = '<div class="goal-card">' +
            '<h3>' + goal.name + '</h3>' +
            '<div class="progress-circle">' +
            '<svg width="120" height="120" viewBox="0 0 120 120">' +
            '<circle class="progress-bg" cx="60" cy="60" r="52"/>' +
            '<circle class="progress-bar" cx="60" cy="60" r="52" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '"/>' +
            '</svg>' +
            '<div class="progress-text">' + percent + '%</div>' +
            '</div>' +
            '<div class="goal-stats">' +
            '<div class="goal-stat"><span class="label">Saved</span><span class="value green">₹' + formatNumber(goal.saved) + '</span></div>' +
            '<div class="goal-stat"><span class="label">Remaining</span><span class="value">₹' + formatNumber(remaining) + '</span></div>' +
            '<div class="goal-stat"><span class="label">Target</span><span class="value">₹' + formatNumber(goal.target) + '</span></div>' +
            '<div class="goal-stat"><span class="label">Days Left</span><span class="value">' + daysLeft + ' days</span></div>' +
            '</div>' +
            '<div class="goal-actions">' +
            '<input type="number" class="goal-input" placeholder="Add amount" id="goal-add-' + goal.id + '">' +
            '<button class="goal-btn" onclick="addToGoal(' + goal.id + ')"><i class="fas fa-chart-line"></i></button>' +
            '</div>' +
            '</div>';

        container.innerHTML = container.innerHTML + html;
    }

    if (appData.goals.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px; grid-column: 1/-1;">No goals yet. Create your first goal!</p>';
    }
}

// Add amount to goal
function addToGoal(goalId) {
    var input = document.getElementById('goal-add-' + goalId);
    var amount = parseInt(input.value);

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    for (var i = 0; i < appData.goals.length; i++) {
        if (appData.goals[i].id === goalId) {
            appData.goals[i].saved = appData.goals[i].saved + amount;
            break;
        }
    }

    saveData();
    renderGoals();
    input.value = '';
}

// Open goal modal
function openGoalModal() {
    document.getElementById('goal-modal').classList.add('active');
}

// Close goal modal
function closeGoalModal() {
    document.getElementById('goal-modal').classList.remove('active');
}

// Add new goal
function addGoal(event) {
    event.preventDefault();

    var name = document.getElementById('goal-name').value;
    var target = parseInt(document.getElementById('goal-target').value);
    var saved = parseInt(document.getElementById('goal-saved').value) || 0;
    var targetDate = document.getElementById('goal-date').value;

    var newGoal = {
        id: Date.now(),
        name: name,
        target: target,
        saved: saved,
        targetDate: targetDate
    };

    appData.goals.push(newGoal);
    saveData();

    document.getElementById('goal-form').reset();
    closeGoalModal();
    renderGoals();
}

// Form submit handler
document.getElementById('goal-form').addEventListener('submit', addGoal);

// Load data when page loads
loadData();
