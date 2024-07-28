let doors = [0, 0, 0]; // 0: goat, 1: car
let selectedDoor, revealedDoor;
let isGameOver = false;

function initializeGame() {
    doors = [0, 0, 0];
    doors[Math.floor(Math.random() * 3)] = 1; // Place the car randomly
    selectedDoor = null;
    revealedDoor = null;
    isGameOver = false;

    document.querySelectorAll('.door').forEach(door => {
        door.classList.remove('selected', 'revealed');
        door.style.backgroundColor = '';
        door.textContent = `Door ${door.id.slice(-1)}`;
    });

    document.getElementById('game-message').textContent = 'Select a door to start.';
    document.getElementById('switch-door').style.display = 'none';
    document.getElementById('stay').style.display = 'none';
    document.getElementById('reset').style.display = 'none';
}

function selectDoor(doorNumber) {
    if (isGameOver || selectedDoor !== null) return;

    selectedDoor = doorNumber - 1; // Convert to 0-based index
    document.getElementById(`door${doorNumber}`).classList.add('selected');
    document.getElementById('game-message').textContent = 'Door selected. The host will now reveal a goat.';

    setTimeout(() => {
        revealGoatDoor();
        document.getElementById('game-message').textContent = 'A goat has been revealed. Do you want to switch or stay?';
        document.getElementById('switch-door').style.display = 'inline-block';
        document.getElementById('stay').style.display = 'inline-block';
    }, 1000);
}

function revealGoatDoor() {
    do {
        revealedDoor = Math.floor(Math.random() * 3);
    } while (revealedDoor === selectedDoor || doors[revealedDoor] === 1);

    document.getElementById(`door${revealedDoor + 1}`).classList.add('revealed');
    document.getElementById(`door${revealedDoor + 1}`).textContent = 'Goat';
}

function switchDoor() {
    if (isGameOver) return;

    const newDoor = 3 - selectedDoor - revealedDoor; // Find the remaining door
    document.getElementById(`door${selectedDoor + 1}`).classList.remove('selected');
    document.getElementById(`door${newDoor + 1}`).classList.add('selected');
    selectedDoor = newDoor;

    checkResult();
}

function stay() {
    if (isGameOver) return;
    checkResult();
}

function checkResult() {
    isGameOver = true;
    document.getElementById('switch-door').style.display = 'none';
    document.getElementById('stay').style.display = 'none';
    document.getElementById('reset').style.display = 'inline-block';

    for (let i = 0; i < 3; i++) {
        const doorElement = document.getElementById(`door${i + 1}`);
        doorElement.textContent = doors[i] === 1 ? 'Car' : 'Goat';
        doorElement.style.backgroundColor = doors[i] === 1 ? '#FFD700' : '#FFA500';
    }

    if (doors[selectedDoor] === 1) {
        document.getElementById('game-message').textContent = 'Congratulations! You won the car!';
    } else {
        document.getElementById('game-message').textContent = 'Sorry, you got a goat. Better luck next time!';
    }
}

function runSimulation() {
    const trials = parseInt(document.getElementById('trials').value);

    fetch('/simulate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trials: trials }),
    })
    .then(response => response.json())
    .then(data => {
        updateChart(data.stay_percentage, data.switch_percentage, trials);
    });
}

let chart;

function updateChart(stayPercentage, switchPercentage, trials) {
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
                    text: `Monty Hall Simulation Results (${trials} trials)`
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    document.getElementById('door1').addEventListener('click', () => selectDoor(1));
    document.getElementById('door2').addEventListener('click', () => selectDoor(2));
    document.getElementById('door3').addEventListener('click', () => selectDoor(3));
    document.getElementById('switch-door').addEventListener('click', switchDoor);
    document.getElementById('stay').addEventListener('click', stay);
    document.getElementById('reset').addEventListener('click', initializeGame);
    document.getElementById('run-simulation').addEventListener('click', runSimulation);
});