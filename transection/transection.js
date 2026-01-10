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





var data = [];

function fetchData() {
    data = JSON.parse(localStorage.getItem('transactions')) || [];
    data.forEach(obj => {
        displayTrans(obj);
    });
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
                        <div class="sAmt">${(obj.incExp=='expense')? '-' : "+"}${obj.amount}</div>
                        <div class="seeIncExp s${obj.incExp}">${obj.incExp}</div>
                    </div>`
    seeTransCardDisplay.appendChild(div);
}
function setData(newData) {
    console.log('setDataCalled');

    data.push(newData);
    localStorage.setItem('transactions', JSON.stringify(data));
}
function handle() {
    console.log(category1.value , category2.value);
    
    
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