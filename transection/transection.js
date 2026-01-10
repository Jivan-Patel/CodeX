// ============================================
// DOM Elements
// ============================================
const switchIncome = document.getElementById('addIncBtn');
const switchExpense = document.getElementById('addExpBtn');
const addInc = document.getElementById('addInc');
const addExp = document.getElementById('addExp');

const category1 = document.getElementById('category1');
const category2 = document.getElementById('category2');

const amountInp = document.getElementById('amountInp');
const dateInp = document.getElementById('dateInp');
const descriptionInp = document.getElementById('descriptionInp');

const addExpenseBtn = document.getElementById('addExpeBtn');
const addIncomeBtn = document.getElementById('addIncoBtn');

const transactionForm = document.getElementById('transactionForm');
const seeTransCardDisplay = document.getElementById('transactionList');
const emptyState = document.getElementById('emptyState');

const toast = document.getElementById('toast');
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');

const filterBtns = document.querySelectorAll('.filterBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');

// ============================================
// State
// ============================================
let data = [];
let incExpToggle = 'expense';
let currentFilter = 'all';
let pendingDeleteCallback = null;

// Category emoji mapping
const categoryEmojis = {
    'food': '🍲',
    'entertainment': '🎬',
    'travel': '✈️',
    'medical': '🩺',
    'bills': '📑',
    'education': '📖',
    'shopping': '🛒',
    'others': '🔗',
    'Salary': '💼',
    'Freelancing': '💻',
    'Investments': '📈',
    'Gifts': '🎁',
    'Others': '🔗'
};

// ============================================
// Toast Notification
// ============================================
function showToast(message, type = 'success') {
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    toastIcon.textContent = type === 'success' ? '✅' : type === 'error' ? '❌' : '🗑️';
    toastMessage.textContent = message;
    
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// Delete Confirmation Modal
// ============================================
function showDeleteModal(callback) {
    pendingDeleteCallback = callback;
    deleteModal.classList.add('show');
}

function hideDeleteModal() {
    deleteModal.classList.remove('show');
    pendingDeleteCallback = null;
}

confirmDeleteBtn.addEventListener('click', () => {
    if (pendingDeleteCallback) {
        pendingDeleteCallback();
    }
    hideDeleteModal();
});

cancelDeleteBtn.addEventListener('click', hideDeleteModal);

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        hideDeleteModal();
    }
});

// ============================================
// Income/Expense Toggle
// ============================================
function switchIncExpToggle() {
    if (incExpToggle === 'expense') {
        switchIncome.classList.add('incToggleActive');
        switchExpense.classList.remove('expToggleActive');
        addInc.style.display = 'flex';
        addIncomeBtn.style.display = 'block';
        addExpenseBtn.style.display = 'none';
        category1.value = "";
        addExp.style.display = 'none';
        incExpToggle = 'income';
        category1.removeAttribute('required');
        category2.setAttribute('required', '');
    } else {
        switchExpense.classList.add('expToggleActive');
        switchIncome.classList.remove('incToggleActive');
        addExp.style.display = 'flex';
        category2.value = "";
        addInc.style.display = 'none';
        addExpenseBtn.style.display = 'block';
        addIncomeBtn.style.display = 'none';
        incExpToggle = 'expense';
        category2.removeAttribute('required');
        category1.setAttribute('required', '');
    }
}

switchIncome.addEventListener('click', switchIncExpToggle);
switchExpense.addEventListener('click', switchIncExpToggle);

// ============================================
// Set Default Date to Today
// ============================================
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    dateInp.value = today;
}

// ============================================
// Empty State Management
// ============================================
function updateEmptyState() {
    const visibleCards = seeTransCardDisplay.querySelectorAll('.scard');
    if (visibleCards.length === 0) {
        emptyState.style.display = 'flex';
    } else {
        emptyState.style.display = 'none';
    }
}

// ============================================
// Fetch and Display Data
// ============================================
function fetchData() {
    data = JSON.parse(localStorage.getItem('transactions')) || [];
    renderTransactions();
}

function renderTransactions() {
    seeTransCardDisplay.innerHTML = '';
    
    const filteredData = currentFilter === 'all' 
        ? data 
        : data.filter(item => item.incExp === currentFilter);
    
    // Sort by date (newest first)
    const sortedData = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedData.forEach(item => displayTrans(item));
    updateEmptyState();
}

function displayTrans(obj) {
    const div = document.createElement('div');
    div.classList.add('scard');
    div.dataset.type = obj.incExp;
    
    // Get category with emoji
    const emoji = categoryEmojis[obj.catagory] || '📌';
    const categoryDisplay = `${emoji} ${obj.catagory}`;
    
    // Format date nicely
    const dateFormatted = formatDate(obj.date);
    
    // Format amount with currency
    const amountFormatted = `₹${Number(obj.amount).toLocaleString()}`;
    const amountSign = obj.incExp === 'expense' ? '-' : '+';
    
    div.innerHTML = `
        <div class="scardP1 scardP">
            <div class="sCat">${categoryDisplay}</div>
            <div class="sdate">${dateFormatted}</div>
            <div class="snote">${obj.description || 'No description'}</div>
        </div>
        <div class="scardP2 scardP">
            <div class="sAmt ${obj.incExp}">${amountSign}${amountFormatted}</div>
            <div class="seeIncExp s${obj.incExp}">${obj.incExp}</div>
        </div>`;
                    
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
    div.appendChild(deleteBtn);
    
    deleteBtn.addEventListener('click', () => {
        showDeleteModal(() => {
            deleteTransaction(obj);
            div.remove();
            showToast('Transaction deleted', 'delete');
            updateEmptyState();
        });
    });
    
    seeTransCardDisplay.appendChild(div);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

function deleteTransaction(obj) {
    data = data.filter(item => !(
        item.date === obj.date && 
        item.catagory === obj.catagory && 
        item.description === obj.description && 
        item.amount === obj.amount && 
        item.incExp === obj.incExp
    ));
    localStorage.setItem('transactions', JSON.stringify(data));
}

// ============================================
// Add Transaction
// ============================================
function setData(newData) {
    data.push(newData);
    localStorage.setItem('transactions', JSON.stringify(data));
}

function handleSubmit(e) {
    e.preventDefault();
    
    const amountValue = amountInp.value;
    const dateValue = dateInp.value;
    const descValue = descriptionInp.value;
    const categoryValue = (incExpToggle === 'expense') ? category1.value : category2.value;
    
    if (amountValue === "" || dateValue === "" || categoryValue === "") {
        showToast('Please fill all required fields', 'error');
        return;
    }

    const transactionData = {
        date: dateValue,
        catagory: categoryValue,
        description: descValue,
        amount: amountValue,
        wallet: "defaultWallet",
        incExp: incExpToggle
    };
    
    setData(transactionData);
    renderTransactions();
    
    // Show success message
    const typeLabel = incExpToggle === 'expense' ? 'Expense' : 'Income';
    showToast(`${typeLabel} of ₹${Number(amountValue).toLocaleString()} added!`, 'success');
    
    // Reset form
    resetForm();
}

function resetForm() {
    amountInp.value = '';
    category1.value = '';
    category2.value = '';
    descriptionInp.value = '';
    setDefaultDate();
}

// ============================================
// Filter Functionality
// ============================================
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTransactions();
    });
});

// ============================================
// Export CSV Functionality
// ============================================
function exportToCSV() {
    if (data.length === 0) {
        showToast('No transactions to export', 'error');
        return;
    }
    
    // Navigate to the Export page
    window.location.href = './Export/index.html';
}

exportCsvBtn.addEventListener('click', exportToCSV);

// ============================================
// Form Submit Event Listeners
// ============================================
transactionForm.addEventListener('submit', handleSubmit);

// ============================================
// Initialize
// ============================================
setDefaultDate();
fetchData();