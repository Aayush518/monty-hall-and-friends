let doorCount = 3;
let doors = [];
let selectedDoor, revealedDoors = [], prizeDoor;
let isGameOver = false;
let timeLeft = 30;
let timer;
let streak = 0;
let gamesPlayed = 0;
let wins = 0;

function initializeGame() {
    createDoors();
    resetGame();
}

function createDoors() {
    const doorsContainer = document.getElementById('doors-container');
    doorsContainer.innerHTML = '';
    doors = [];
    for (let i = 0; i < doorCount; i++) {
        const door = document.createElement('div');
        door.className = 'door';
        door.innerHTML = `
            <div class="door-inner">
                <div class="door-front">${i + 1}</div>
                <div class="door-back"></div>
            </div>`;
        door.addEventListener('click', () => selectDoor(i));
        doorsContainer.appendChild(door);
        doors.push(door);
    }
}

function selectDoor(doorIndex) {
    if (isGameOver || selectedDoor !== undefined) return;
    selectedDoor = doorIndex;
    doors[doorIndex].classList.add('selected');
    document.getElementById('switch-door').classList.remove('hidden');
    document.getElementById('stay').classList.remove('hidden');
    revealGoatDoors();
}

function revealGoatDoors() {
    prizeDoor = Math.floor(Math.random() * doorCount);
    for (let i = 0; i < doorCount; i++) {
        if (i !== selectedDoor && i !== prizeDoor) {
            revealedDoors.push(i);
            doors[i].classList.add('revealed');
            doors[i].querySelector('.door-back').textContent = '🐐';
        }
    }
    if (revealedDoors.length === doorCount - 2) {
        startTimer();
    }
}

function switchDoor() {
    if (isGameOver) return;
    const availableDoors = doors.filter((_, i) => i !== selectedDoor && !revealedDoors.includes(i));
    const newDoor = availableDoors[Math.floor(Math.random() * availableDoors.length)];
    doors[selectedDoor].classList.remove('selected');
    newDoor.classList.add('selected');
    selectedDoor = doors.indexOf(newDoor);
    checkResult();
}

function stay() {
    if (isGameOver) return;
    checkResult();
}

function checkResult() {
    isGameOver = true;
    clearInterval(timer);
    document.getElementById('switch-door').classList.add('hidden');
    document.getElementById('stay').classList.add('hidden');
    document.getElementById('reset').classList.remove('hidden');

    doors.forEach((door, i) => {
        door.classList.add('revealed');
        const backSide = door.querySelector('.door-back');
        if (i === prizeDoor) {
            backSide.textContent = '🚗';
            backSide.classList.add('car');
        } else {
            backSide.textContent = '🐐';
        }
    });

    if (selectedDoor === prizeDoor) {
        document.getElementById('game-message').textContent = 'You win! You found the car! 🎉';
        streak++;
        wins++;
    } else {
        document.getElementById('game-message').textContent = 'You lose! You got a goat. 🐐';
        streak = 0;
    }
    gamesPlayed++;
    updateStats();
}

function resetGame() {
    isGameOver = false;
    selectedDoor = undefined;
    revealedDoors = [];
    prizeDoor = undefined;
    document.getElementById('game-message').textContent = '';
    document.getElementById('reset').classList.add('hidden');
    document.getElementById('switch-door').classList.add('hidden');
    document.getElementById('stay').classList.add('hidden');
    document.getElementById('time-left').textContent = '30';

    doors.forEach(door => {
        door.classList.remove('selected', 'revealed');
        door.querySelector('.door-back').className = 'door-back';
    });

    timeLeft = 30;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkResult();
        }
    }, 1000);
}

function updateStats() {
    document.getElementById('streak').textContent = streak;
    document.getElementById('games-played').textContent = gamesPlayed;
    document.getElementById('win-rate').textContent = `${((wins / gamesPlayed) * 100).toFixed(2)}%`;
}

function runSimulation() {
    const trials = parseInt(document.getElementById('trials').value);
    const simDoorCount = parseInt(document.getElementById('sim-door-count').value);

    fetch('/simulate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trials: trials, doors: simDoorCount }),
    })
    .then(response => response.json())
    .then(data => {
        updateChart(data.stay_percentage, data.switch_percentage, trials, simDoorCount);
    });
}

let chart;

function updateChart(stayPercentage, switchPercentage, trials, doors) {
    const ctx = document.getElementById('results-chart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Stay', 'Switch'],
            datasets: [{
                label: 'Win Percentage',
                data: [stayPercentage, switchPercentage],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Monty Hall Simulation Results (${trials} trials, ${doors} doors)`
                }
            }
        }
    });
}

function updateDoorCount() {
    doorCount = parseInt(document.getElementById('door-count').value);
    resetGame();
    createDoors();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    document.getElementById('door-count').addEventListener('change', updateDoorCount);
    document.getElementById('switch-door').addEventListener('click', switchDoor);
    document.getElementById('stay').addEventListener('click', stay);
    document.getElementById('reset').addEventListener('click', resetGame);
    document.getElementById('run-simulation').addEventListener('click', runSimulation);
    playExplanationVideo();

});