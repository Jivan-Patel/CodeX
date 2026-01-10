// chart section (line graph)

const ctx = document.getElementById('line_graph');

var i = -1;

const isSmallScreen = window.innerWidth < 800;

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["nov", "dec", "jan"],
        datasets: [{
            pointRadius: isSmallScreen ? 3 : 6,
            pointBackgroundColor: '#6C7CFF',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            tension: 0.3,
            backgroundColor: "rgba(105, 100, 219,0.2)",
            fill: true,
            label: '# of Votes',
            data: [13000, 14000, 40000],
            borderColor: [
                "rgba(105, 100, 219,1)"
            ],
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 14,
                        color: "white"
                    }
                },
                grid: {
                    color: "rgba(155, 155, 255,0.1)",
                }
            },
            x: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 14,
                        color: "white"
                    }
                },
                grid: {
                    color: "rgba(155, 155, 255,0.1)"
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// chart section (pie chart)

const ctx2 = document.getElementById('pie_chart');

const isSmallScreen2 = window.innerWidth < 800;

new Chart(ctx2, {
    type: 'pie',
    data: {
        labels: ["nov", "dec", "jan", "nov", "dec", "jan"],
        datasets: [{
            fill: true,
            label: '# of Votes',
            data: [13000, 14000, 40000, 13000, 14000, 40000],
            backgroundColor: [
                random_colour_pie_chart(),
                random_colour_pie_chart(),
                random_colour_pie_chart(),
                random_colour_pie_chart(),
                random_colour_pie_chart(),
                random_colour_pie_chart()
            ],
            borderColor: [
                "rgba(105, 100, 219,1)"
            ],
            borderWidth: 0
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    display: false,
                },
                grid: {
                    display: false
                }
            },
            x: {
                beginAtZero: true,
                ticks: {
                    display: false,
                },
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// colour function for pie chart

function random_colour_pie_chart() {
    var color_arr = [
        "rgb(195, 151, 20)",
        "rgb(199, 65, 136)",
        "rgb(208, 99, 32)",
        "rgb(56, 111, 211)",
        "rgb(142, 76, 212)"
    ];

    if (i == 4) {
        i = 0;
    }

    i++;

    return color_arr[i];
}



////

let obj = {};

function fetchData() {
    data = JSON.parse(localStorage.getItem('transactions'));

    // data.forEach(element => {
    //     if (obj[element.category]==undefined) {
    //         obj[element.category]=[];
    //         for (let j = 0; j < data.length; j++) {
    //             if (data[j].category == element.category){
    //                 obj[element.category].push(data[j].amount);
    //             }
    //         }
    //     }
    // });
    // console.log(obj);

    for (let j = 0; j < data.length; j++) {
        if (obj[data[j].category] == undefined) {
            obj[data[j].category] = [];
            for (let k = 0; k < data.length; k++) {
                if (data[k].category == data[j].category) {
                    obj[data[j].category].push(data[k].amount);
                }
            }
        }
    }
    console.log(obj);
}

fetchData();