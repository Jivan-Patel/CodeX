document.addEventListener("DOMContentLoaded", function () {
  
  const pdfDate = document.getElementById("pdfDate");
  if (pdfDate) {
    pdfDate.innerText = new Date().toLocaleDateString();
  }

  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const tableBody = document.getElementById("transactionTableBody");

  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");

    const dateFormatted = transaction.date || "N/A";

    const description =
      transaction.description || transaction.catagory || "No description";

    const isExpense = transaction.incExp === "expense";
    const amount = parseFloat(transaction.amount) || 0;

    if (isExpense) {
      totalExpense += amount;
    } else {
      totalIncome += amount;
    }

    row.innerHTML = `
      <td>${dateFormatted}</td>
      <td>${description}</td>
      <td class="${isExpense ? "expense-text" : "income-text"}">${
      isExpense ? "Expense" : "Income"
    }</td>
      <td class="amount ${isExpense ? "amount-negative" : "amount-positive"}">${
      isExpense ? "- " : "+ "
    }₹${amount.toLocaleString()}</td>
    `;

    tableBody.appendChild(row);
  });

  if (transactions.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML =
      '<td colspan="4" style="text-align: center; padding: 20px; color: #666;">No transactions found. Add transactions from the main page.</td>';
    tableBody.appendChild(emptyRow);
  }

  const incomeEl = document.getElementById("totalIncome");
  const expenseEl = document.getElementById("totalExpense");
  const netEl = document.getElementById("netIncome");

  if (incomeEl) {
    incomeEl.innerText = "₹" + totalIncome.toLocaleString();
    incomeEl.classList.add("amount-positive");
  }

  if (expenseEl) {
    expenseEl.innerText = "₹" + totalExpense.toLocaleString();
    expenseEl.classList.add("amount-negative");
  }

  const netIncome = totalIncome - totalExpense;

  if (netEl) {
    netEl.innerText = "₹" + netIncome.toLocaleString();
    netEl.classList.add(netIncome >= 0 ? "amount-positive" : "amount-negative");
  }

  const resultText = document.getElementById("profitLossText");

  if (resultText) {
    if (netIncome >= 0) {
      resultText.textContent = "PROFIT ₹" + netIncome.toLocaleString();
      resultText.classList.add("profit");
      resultText.style.color = "#157A36";
    } else {
      resultText.textContent = "LOSS ₹" + Math.abs(netIncome).toLocaleString();
      resultText.classList.add("loss");
      resultText.style.color = "#B81B19";
    }
  }

  const exportBtn = document.getElementById("exportPdfBtn");

  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      const pdfContent = document.getElementById("pdfContent");

      const options = {
        margin: 0.5,
        filename: "finance-report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      };

      html2pdf().set(options).from(pdfContent).save();
    });
  }
});
