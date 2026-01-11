const seeTransCardDisplay = document.querySelector('.seeTransCard');
const monthIncDisplay = document.getElementById('monthInc');
const monthExpDisplay = document.getElementById('monthExp');
const totalBalanceDisplay = document.getElementById('totalBalance');
const healthScoreDisplay = document.getElementById('healthScore');
const healthStatusDisplay = document.getElementById('healthStatus');

var data = [];
let totalInc = 0;
let totalExp = 0;
let monthExp = 0;
let monthInc = 0;
let initialBalance = null;

// Calculate Financial Health Score
function calculateHealthScore(transactions) {
    const totalIncome = transactions
        .filter(t => t.incExp === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
        .filter(t => t.incExp === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    // Calculate savings rate
    let savingsRate = 0;
    if (totalIncome > 0) {
        const savings = totalIncome - totalExpenses;
        savingsRate = Math.round((savings / totalIncome) * 100);
    }

    // Calculate spending trend
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthExpenses = transactions
        .filter(t => {
            if (t.incExp !== 'expense') return false;
            const d = new Date(t.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const lastMonthExpenses = transactions
        .filter(t => {
            if (t.incExp !== 'expense') return false;
            const d = new Date(t.date);
            return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
        })
        .reduce((sum, t) => sum + Number(t.amount), 0);

    let trend = 'Stable';
    if (lastMonthExpenses > 0) {
        const change = ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
        if (change > 10) trend = 'Increasing';
        else if (change < -10) trend = 'Decreasing';
    }

    // Calculate health score (0-100)
    let score = 50; // Base score

    // Savings rate contribution (up to 40 points)
    if (savingsRate >= 50) score += 40;
    else if (savingsRate >= 30) score += 30;
    else if (savingsRate >= 20) score += 20;
    else if (savingsRate >= 10) score += 10;
    else if (savingsRate < 0) score -= 20;

    // Spending trend contribution (up to 10 points)
    if (trend === 'Decreasing') score += 10;
    else if (trend === 'Increasing') score -= 10;

    score = Math.max(0, Math.min(100, score));

    let status = 'Poor';
    if (score >= 80) status = 'Excellent';
    else if (score >= 60) status = 'Good';
    else if (score >= 40) status = 'Fair';

    return { score, status };
}

function fetchData() {
    data = JSON.parse(localStorage.getItem('transactions')) || [];
    initialBalance = Number(localStorage.getItem('initialBalance'));
    if (!initialBalance) {
        initialBalance = Number(prompt("Enter Initial Balance"));
        localStorage.setItem('initialBalance', initialBalance);
    }
    if (data.length === 0) {
        seeTransCardDisplay.innerHTML = 'No data Added Yet';
    }
    else {
        seeTransCardDisplay.innerHTML = '';
    }

    // Calculate total income and expenses
    for (const obj of data) {
        if (obj.incExp === 'expense') {
            totalExp += Number(obj.amount);
        }
        else {
            totalInc += Number(obj.amount);
        }
    }

    // Display recent 5 transactions
    for (let i = data.length - 1; i > data.length - 1 - 5; i--) {
        if (i < 0) break;
        displayTrans(data[i]);
    }

    // Get CURRENT month data (fixed from last month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentMonthData = data.filter(item => {
        const d = new Date(item.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    console.log('Current month transactions:', currentMonthData);
    
    // Calculate current month income and expenses
    for (const dta of currentMonthData) {
        if (dta.incExp === 'expense') {
            monthExp += Number(dta.amount);
        }
        else {
            monthInc += Number(dta.amount);
        }
    }
    
    // Update the display with currency formatting
    monthIncDisplay.innerHTML = '₹' + monthInc.toLocaleString();
    monthExpDisplay.innerHTML = '₹' + monthExp.toLocaleString();
    totalBalanceDisplay.innerHTML = '₹' + (initialBalance + totalInc - totalExp).toLocaleString();

    // Update Financial Health Score
    const health = calculateHealthScore(data);
    if (healthScoreDisplay) {
        healthScoreDisplay.innerHTML = `${health.score}/100`;
    }
    if (healthStatusDisplay) {
        healthStatusDisplay.innerHTML = health.status;
    }
}

function displayTrans(obj) {
    let div = document.createElement('div');
    div.classList.add('scard');
    console.log(obj.catagory);

    div.innerHTML = `<div class="scardP1 scardP">
                        <div class="sCat">${obj.catagory}</div>
                        <div class="sdate">${obj.date}</div>
                        <div class="snote">${obj.description}</div>
                    </div>
                    <div class="scardP2 scardP">
                        <div class="sAmt">${(obj.incExp === 'expense') ? '-' : "+"}₹${Number(obj.amount).toLocaleString()}</div>
                        <div class="seeIncExp s${obj.incExp}">${obj.incExp}</div>
                    </div>`;
    seeTransCardDisplay.appendChild(div);
}

function recentTrans() {
    console.log(data);
}

fetchData();