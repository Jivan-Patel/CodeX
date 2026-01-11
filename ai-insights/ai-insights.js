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

function loadData() {
    appData.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    appData.goals = JSON.parse(localStorage.getItem('goals')) || [];
    updateInsights();
}

function formatNumber(num) {
    return num.toLocaleString('en-IN');
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function calculateTotals() {
    var totalIncome = 0;
    var totalExpenses = 0;

    for (var i = 0; i < appData.transactions.length; i++) {
        var t = appData.transactions[i];
        if (t.incExp === 'income') {
            totalIncome = totalIncome + Number(t.amount);
        } else {
            totalExpenses = totalExpenses + Number(t.amount);
        }
    }

    return {
        income: totalIncome,
        expenses: totalExpenses,
        balance: totalIncome - totalExpenses
    };
}

function updateInsights() {
    var totals = calculateTotals();
    var savingsRate = totals.income > 0 ? Math.round(((totals.income - totals.expenses) / totals.income) * 100) : 0;
    var healthScore = Math.min(100, Math.round(savingsRate * 1.5));

    var categories = {};
    for (var i = 0; i < appData.transactions.length; i++) {
        var t = appData.transactions[i];
        if (t.incExp === 'expense') {
            if (!categories[t.category]) {
                categories[t.category] = 0;
            }
            categories[t.category] = categories[t.category] + Number(t.amount);
        }
    }

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

    var prediction = Math.round(totals.expenses * 1.2);
    document.getElementById('prediction').textContent = 'Next month prediction: ₹' + formatNumber(prediction);
}

function analyzeFinances() {
    var btn = document.querySelector('.btn-analyze');
    btn.textContent = 'Analyzing...';
    btn.disabled = true;

    setTimeout(function () {
        btn.innerHTML = '<i class="fas fa-brain"></i> Analyze My Finances';
        btn.disabled = false;

        var totals = calculateTotals();
        var savingsRate = totals.income > 0 ? Math.round(((totals.income - totals.expenses) / totals.income) * 100) : 0;

        var recommendations = [];

        var categories = {};
        for (var i = 0; i < appData.transactions.length; i++) {
            var t = appData.transactions[i];
            if (t.incExp === 'expense') {
                if (!categories[t.category]) {
                    categories[t.category] = 0;
                }
                categories[t.category] = categories[t.category] + Number(t.amount);
            }
        }

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

loadData();
