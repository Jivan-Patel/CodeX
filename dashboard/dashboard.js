const seeTransCardDisplay = document.querySelector('.seeTransCard');
const monthIncDisplay = document.getElementById('monthInc')
const monthExpDisplay = document.getElementById('monthExp')
const totalBalanceDisplay = document.getElementById('totalBalance')

var data = [];
let totalInc = 0;
let totalExp = 0;
let monthExp = 0;
let monthInc = 0;
let initialBalance = null;


function fetchData() {
    data = JSON.parse(localStorage.getItem('transactions')) || [];
    initialBalance = Number(localStorage.getItem('initialBalance'));
    if (!initialBalance) {
        initialBalance = Number(prompt("Enter Initial Balance"));
        localStorage.setItem('initialBalance', initialBalance);
    }
    if (data.length===0) { 
        seeTransCardDisplay.innerHTML = 'No data Added Yet';
    }
    else {
        seeTransCardDisplay.innerHTML = '';
    }



    for (obj of data) {
        if (obj.incExp == 'expense') {
            totalExp += Number(obj.amount);
        }
        else {
            totalInc += Number(obj.amount);
        }
    }

    for (let i = data.length - 1; i > data.length - 1 - 5; i--) {
        if (i < 0) break;
        displayTrans(data[i]);
    }

    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const lastMonthData = data.filter(item => {
        const d = new Date(item.date);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });

    console.log(lastMonthData);
    for (dta of lastMonthData) {

        if (dta.incExp === 'expense') {
            monthExp += Number(dta.amount);
        }
        else {
            monthInc += Number(dta.amount);
        }
    }
    monthIncDisplay.innerHTML = monthInc;
    monthExpDisplay.innerHTML = monthExp;
    totalBalanceDisplay.innerHTML = initialBalance + totalInc - totalExp;
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
                        <div class="sAmt">${(obj.incExp == 'expense') ? '-' : "+"}${obj.amount}</div>
                        <div class="seeIncExp s${obj.incExp}">${obj.incExp}</div>
                    </div>`;
    seeTransCardDisplay.appendChild(div);


}

function recentTrans() {
    console.log(data);
}

fetchData();