// AI Insights JavaScript
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

// Load data from localStorage
function loadData() {
    var saved = localStorage.getItem('financeAI_data');
    if (saved) {
        appData = JSON.parse(saved);
    }
    updateInsights();
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

// Update insights
function updateInsights() {
    var totals = calculateTotals();
    var savingsRate = totals.income > 0 ? Math.round(((totals.income - totals.expenses) / totals.income) * 100) : 0;
    var healthScore = Math.min(100, Math.round(savingsRate * 1.5));

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
    document.getElementById('top-spending').textContent = catIcon.icon + ' ' + capitalize(topCat);
    document.getElementById('top-spending-amount').textContent = '₹' + formatNumber(topAmount) + ' this period';
    document.getElementById('health-score').textContent = healthScore + '/100';
    document.getElementById('savings-rate').textContent = savingsRate + '%';

    // Prediction (simple estimate)
    var prediction = Math.round(totals.expenses * 1.2);
    document.getElementById('prediction').textContent = 'Next month prediction: ₹' + formatNumber(prediction);
}

// Analyze finances (AI simulation)
function analyzeFinances() {
    var btn = document.querySelector('.btn-analyze');
    btn.textContent = 'Analyzing...';
    btn.disabled = true;

    setTimeout(function () {
        btn.innerHTML = '<i class="fas fa-brain"></i> Analyze My Finances';
        btn.disabled = false;

        var totals = calculateTotals();
        var savingsRate = totals.income > 0 ? Math.round(((totals.income - totals.expenses) / totals.income) * 100) : 0;

        // Generate recommendations based on data
        var recommendations = [];

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

        recommendations.push('💡 Your ' + topCat + ' category is your highest expense. Consider reviewing this for potential savings.');

        if (savingsRate >= 50) {
            recommendations.push('📈 Great job! Your savings rate of ' + savingsRate + '% is excellent. Keep maintaining this healthy financial habit.');
        } else if (savingsRate >= 20) {
            recommendations.push('📊 Your savings rate is ' + savingsRate + '%. Try to increase it to 30% or more for better financial security.');
        } else {
            recommendations.push('⚠️ Your savings rate is ' + savingsRate + '%. Consider reducing expenses to save at least 20% of your income.');
        }

        if (appData.goals.length > 0) {
            var activeGoals = 0;
            for (var i = 0; i < appData.goals.length; i++) {
                if (appData.goals[i].saved < appData.goals[i].target) {
                    activeGoals++;
                }
            }
            if (activeGoals > 0) {
                recommendations.push('🎯 You have ' + activeGoals + ' active goal(s). Keep adding regularly to reach your targets.');
            }
        } else {
            recommendations.push('🎯 Consider setting up financial goals to stay motivated and track your progress.');
        }

        recommendations.push('💰 Consider investing your surplus savings in mutual funds or fixed deposits for better long-term returns.');

        var container = document.getElementById('recommendations');
        container.innerHTML = '';

        for (var i = 0; i < recommendations.length; i++) {
            container.innerHTML = container.innerHTML + '<div class="recommendation-item">' + recommendations[i] + '</div>';
        }

        alert('Analysis complete! Check the recommendations below.');
    }, 1500);
}

// Load data when page loads
loadData();
