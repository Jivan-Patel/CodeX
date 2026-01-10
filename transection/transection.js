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

const seeTransCardDisplay = document.querySelector('.seeTransCard');

var data = [];

var incExpToggle = 'expense';

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
        category2.setAttribute('required');
    }
    else {
        switchExpense.classList.add('expToggleActive');
        switchIncome.classList.remove('incToggleActive');
        addExp.style.display = 'flex';
        category2.value = "";
        addInc.style.display = 'none';
        addExpenseBtn.style.display = 'block';
        addIncomeBtn.style.display = 'none';
        incExpToggle = 'expense';
        category2.removeAttribute('required');
        category1.setAttribute('required');
    }
}

switchIncome.addEventListener('click', switchIncExpToggle);
switchExpense.addEventListener('click', switchIncExpToggle);






function fetchData() {
    data = JSON.parse(localStorage.getItem('transactions')) || [];
    for (let i = data.length - 1; i >= 0; i--) {
        displayTrans(data[i]);
    }
}
function displayTrans(obj) {
    let div = document.createElement('div');
    div.classList.add('scard');
    div.innerHTML = `<div class="scardP1 scardP">
                        <div class="sCat">${obj.catagory}</div>
                        <div class="sdate">${obj.date}</div>
                        <div class="snote">${obj.description}</div>
                    </div>
                    <div class="scardP2 scardP">
                        <div class="sAmt">${(obj.incExp == 'expense') ? '-' : "+"}${obj.amount}</div>
                        <div class="seeIncExp s${obj.incExp}">${obj.incExp}</div>
                    </div>`;
    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--red-btn)"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
    div.appendChild(deleteBtn);
    seeTransCardDisplay.prepend(div);
    deleteBtn.addEventListener('click', () => {
        seeTransCardDisplay.removeChild(div);
        data = data.filter(item => !(item.date === obj.date && item.catagory === obj.catagory && item.description === obj.description && item.amount === obj.amount && item.incExp === obj.incExp));
        localStorage.setItem('transactions', JSON.stringify(data));
    });

}
function setData(newData) {
    console.log('setDataCalled');

    data.push(newData);
    localStorage.setItem('transactions', JSON.stringify(data));
}
function handle() {
    console.log(category1.value, category2.value);


    const amountValue = amountInp.value;
    const dateValue = dateInp.value;
    const descValue = descriptionInp.value;
    const categoryValue = (incExpToggle == 'expense') ? category1.value : category2.value;
    const walletValue = "defaultWallet"
    if (amountValue === "" || dateValue === "" || categoryValue === "") {
        console.log('returend', amountValue, dateValue, categoryValue);
        return
    };

    const data = {
        date: dateValue,
        catagory: categoryValue,
        description: descValue,
        amount: amountValue,
        wallet: walletValue,
        incExp: incExpToggle
    }
    console.log('handled');
    setData(data);
    displayTrans(data)
}


fetchData();

addExpenseBtn.addEventListener('click', () => {
    console.log('clicked');
    handle();
});
addIncomeBtn.addEventListener('click', () => {
    handle();
});