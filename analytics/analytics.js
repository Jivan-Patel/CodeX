// Analytics JavaScript
// All data stored in localStorage

var appData = {
    transactions: [],
    goals: [],
    settings: {}
};

var categoryIcons = {
    food: { icon: '🍔', color: '#f59e0b' },
    bills: { icon: '💡', color: '#fbbf24' },
    shopping: { icon: '🛍️', color: '#ec4899' },
    travel: { icon: '✈️', color: '#3b82f6' },
    entertainment: { icon: '🎬', color: '#8b5cf6' },
    salary: { icon: '💰', color: '#10b981' },
    other: { icon: '📦', color: '#6b7280' }
};

var categoryChart = null;
var trendChart = null;

// Load data from localStorage
function loadData() {
    var saved = localStorage.getItem('financeAI_data');
    if (saved) {
        appData = JSON.parse(saved);
    }
    updateAnalytics();
}

// Format number with commas
function formatNumber(num) {
    return num.toLocaleString('en-IN');
}

// Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Calculate totals
function calculateTotals() {
    var totalIncome = 0;
    var totalExpenses = 0;

    for (var i = 0; i < appData.transactions.length; i++) {
        var t = appData.transactions[i];
        if (t.type === 'income') {
            totalIncome = totalIncome + t.amount;
        } else {
            totalExpenses = totalExpenses + t.amount;
        }
    }

    return {
        income: totalIncome,
        expenses: totalExpenses,
        balance: totalIncome - totalExpenses
    };
}

// Update analytics charts
function updateAnalytics() {
    var totals = calculateTotals();
    var savingsRate = totals.income > 0 ? Math.round(((totals.income - totals.expenses) / totals.income) * 100) : 0;

    // Update stat cards
    document.getElementById('avg-spend').textContent = formatNumber(Math.round(totals.expenses));
    document.getElementById('savings-rate').textContent = savingsRate + '%';

    // Calculate spending by category
    var categories = {};
    for (var i = 0; i < appData.transactions.length; i++) {
        var t = appData.transactions[i];
        if (t.type === 'expense') {
            if (!categories[t.category]) {
                categories[t.category] = 0;
            }
            categories[t.category] = categories[t.category] + t.amount;
        }
    }

    // Find top category
    var topCat = 'None';
    var topAmount = 0;
    for (var cat in categories) {
        if (categories[cat] > topAmount) {
            topAmount = categories[cat];
            topCat = cat;
        }
    }
    var catIcon = categoryIcons[topCat] || categoryIcons.other;
    document.getElementById('top-category').textContent = catIcon.icon + ' ' + capitalize(topCat);
    document.getElementById('top-category-amount').textContent = '₹' + formatNumber(topAmount);

    // Create pie chart
    var catLabels = [];
    var catData = [];
    var catColors = [];

    for (var cat in categories) {
        catLabels.push(capitalize(cat));
        catData.push(categories[cat]);
        catColors.push(categoryIcons[cat] ? categoryIcons[cat].color : '#6b7280');
    }

    var pieCtx = document.getElementById('categoryChart').getContext('2d');

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: catLabels,
            datasets: [{
                data: catData,
                backgroundColor: catColors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#9ca3af',
                        padding: 15,
                        usePointStyle: true
                    }
                }
            }
        }
    });

    // Create line chart for monthly trend
    var lineCtx = document.getElementById('trendChart').getContext('2d');

    if (trendChart) {
        trendChart.destroy();
    }

    trendChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Nov', 'Dec', 'Jan'],
            datasets: [{
                label: 'Spending',
                data: [12000, 15000, totals.expenses],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#8b5cf6',
                pointBorderColor: '#fff',
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: {
                        color: '#9ca3af',
                        callback: function (value) { return '₹' + (value / 1000) + 'K'; }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Load data when page loads
loadData();
