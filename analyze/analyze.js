
document.addEventListener("DOMContentLoaded", function () {
  const analyzeBtn = document.querySelector(".primary-btn");

  const topSpendingCategory = document.getElementById("topSpendingCategory");
  const topSpendingAmount = document.getElementById("topSpendingAmount");
  const spendingTrend = document.getElementById("spendingTrend");
  const trendPrediction = document.getElementById("trendPrediction");
  const healthScore = document.getElementById("healthScore");
  const healthStatus = document.getElementById("healthStatus");
  const savingsRate = document.getElementById("savingsRate");
  const savingsStatus = document.getElementById("savingsStatus");

  function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
  }

  function calculateTopSpending(transactions) {
    const expenses = transactions.filter((t) => t.incExp === "expense");
    if (expenses.length === 0) return { category: "No Data", amount: 0 };

    const categoryTotals = {};
    expenses.forEach((expense) => {
      const cat = expense.catagory || "Others";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(expense.amount);
    });

    let topCategory = "";
    let topAmount = 0;
    for (const [category, amount] of Object.entries(categoryTotals)) {
      if (amount > topAmount) {
        topCategory = category;
        topAmount = amount;
      }
    }

    return {
      category: topCategory.charAt(0).toUpperCase() + topCategory.slice(1),
      amount: topAmount,
    };
  }

  function calculateSpendingTrend(transactions) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthExpenses = transactions
      .filter((t) => {
        if (t.incExp !== "expense") return false;
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const lastMonthExpenses = transactions
      .filter((t) => {
        if (t.incExp !== "expense") return false;
        const d = new Date(t.date);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    let trend = "Stable";
    let prediction = currentMonthExpenses;

    if (lastMonthExpenses > 0) {
      const change =
        ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
      if (change > 10) {
        trend = "Increasing";
        prediction = Math.round(currentMonthExpenses * 1.1);
      } else if (change < -10) {
        trend = "Decreasing";
        prediction = Math.round(currentMonthExpenses * 0.9);
      }
    }

    return { trend, prediction };
  }

  function calculateSavingsRate(transactions) {
    const totalIncome = transactions
      .filter((t) => t.incExp === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.incExp === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    if (totalIncome === 0) return { rate: 0, status: "Add income data" };

    const savings = totalIncome - totalExpenses;
    const rate = Math.round((savings / totalIncome) * 100);

    let status = "Needs improvement";
    if (rate >= 50) status = "Excellent!";
    else if (rate >= 30) status = "Good progress";
    else if (rate >= 20) status = "On track!";
    else if (rate >= 0) status = "Keep saving";
    else status = "Overspending!";

    return { rate: Math.max(0, rate), status };
  }

  function calculateHealthScore(transactions) {
    const { rate } = calculateSavingsRate(transactions);
    const { trend } = calculateSpendingTrend(transactions);

    let score = 50; // Base score

    // Savings rate contribution (up to 40 points)
    if (rate >= 50) score += 40;
    else if (rate >= 30) score += 30;
    else if (rate >= 20) score += 20;
    else if (rate >= 10) score += 10;
    else if (rate < 0) score -= 20;

    // Spending trend contribution (up to 10 points)
    if (trend === "Decreasing") score += 10;
    else if (trend === "Increasing") score -= 10;

    score = Math.max(0, Math.min(100, score));

    let status = "Poor";
    if (score >= 80) status = "Excellent";
    else if (score >= 60) status = "Good";
    else if (score >= 40) status = "Fair";

    return { score, status };
  }

  function updateUI(transactions) {
    // Top Spending
    const topSpending = calculateTopSpending(transactions);
    if (topSpendingCategory)
      topSpendingCategory.textContent = topSpending.category;
    if (topSpendingAmount)
      topSpendingAmount.textContent = `₹${topSpending.amount.toLocaleString()} this period`;

    // Spending Trend
    const trendData = calculateSpendingTrend(transactions);
    if (spendingTrend) {
      spendingTrend.textContent = trendData.trend;
      spendingTrend.className =
        trendData.trend === "Decreasing"
          ? "success"
          : trendData.trend === "Increasing"
          ? "danger"
          : "";
    }
    if (trendPrediction)
      trendPrediction.textContent = `Next month prediction: ₹${trendData.prediction.toLocaleString()}`;

    // Health Score
    const health = calculateHealthScore(transactions);
    if (healthScore) {
      healthScore.textContent = `${health.score} / 100`;
      healthScore.className =
        health.score >= 60 ? "success" : health.score >= 40 ? "" : "danger";
    }
    if (healthStatus) healthStatus.textContent = health.status;

    // Savings Rate
    const savings = calculateSavingsRate(transactions);
    if (savingsRate) {
      savingsRate.textContent = `${savings.rate}%`;
      savingsRate.className =
        savings.rate >= 30 ? "success" : savings.rate >= 10 ? "" : "danger";
    }
    if (savingsStatus) savingsStatus.textContent = savings.status;
  }

  function analyzeFinances() {
    const transactions = getTransactions();

    if (transactions.length === 0) {
      alert("No transaction data found. Please add transactions first.");
      return;
    }

    updateUI(transactions);
  }

  // Button click handler
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", analyzeFinances);
  }

  // Auto-load data on page load
  const transactions = getTransactions();
  if (transactions.length > 0) {
    updateUI(transactions);
  }
});
