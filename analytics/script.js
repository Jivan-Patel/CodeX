
document.addEventListener("DOMContentLoaded", () => {
    // 1. Read and parse the "transactions" array from localStorage.
    const transactionsRaw = localStorage.getItem("transactions");
    
    if (!transactionsRaw) {
        console.log("No transactions found in localStorage.");
        return;
    }

    let transactions = [];
    try {
        transactions = JSON.parse(transactionsRaw);
    } catch (error) {
        console.error("Error parsing transactions data:", error);
        return;
    }

    // 2. Group transactions using the exact field name "catagory".
    const groupedData = {};

    transactions.forEach(item => {
        // Extract exact field "catagory"
        const catName = item.catagory;
        
        if (!catName) return; // Skip if undefined

        if (!groupedData[catName]) {
            groupedData[catName] = [];
        }

        // 3. Convert amount from string to number.
        const amountVal = Number(item.amount);

        groupedData[catName].push({
            date: item.date,
            catagory: catName,
            wallet: item.wallet,
            amount: amountVal
        });
    });

    // Select the container
    const chartContainer = document.querySelector(".chart_cont");
    
    // Clear existing hardcoded content
    if (chartContainer) {
        chartContainer.innerHTML = "";
        // Ensure vertical stacking for multiple charts
        chartContainer.style.flexDirection = "column";
        chartContainer.style.gap = "30px";
        // Reset width if needed to fit container properly
        chartContainer.style.width = "90%";
    } else {
        console.error("Container .chart_cont not found.");
        return;
    }

    // 4. For each unique catagory
    // 7. Do not hardcode catagories.
    Object.keys(groupedData).forEach(catagory => {
        const items = groupedData[catagory];

        // Create a title element showing the catagory name.
        const titleEl = document.createElement("div");
        titleEl.textContent = catagory;
        titleEl.classList.add("title"); 
        // Ensure title is visible (white is default in this css for .title)
        
        // Create a canvas element for a chart.
        const canvasEl = document.createElement("canvas");
        
        // Append both into ".chart_cont"
        chartContainer.appendChild(titleEl);
        chartContainer.appendChild(canvasEl);

        // 5. Prepare labels and datasets compatible with Chart.js.
        const labels = items.map(i => i.date);
        const dataValues = items.map(i => i.amount);

        // 6. Generate charts dynamically based on available catagories.
        new Chart(canvasEl, {
            type: 'line', 
            data: {
                labels: labels,
                datasets: [{
                    label: catagory,
                    data: dataValues,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: "#fff" },
                        grid: { color: "rgba(255,255,255,0.1)" }
                    },
                    x: {
                        ticks: { color: "#fff" },
                        grid: { color: "rgba(255,255,255,0.1)" }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: "#fff" }
                    }
                }
            }
        });
    });
});