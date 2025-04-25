class Process {
    constructor(pid, arrival, burst, priority = 0) {
        this.pid = pid;
        this.arrival = arrival;
        this.burst = burst;
        this.originalBurst = burst; // Save original burst time for calculations
        this.priority = priority;
        this.completionTime = 0;
        this.turnaroundTime = 0;
        this.waitingTime = 0;
    }
}

// Global variables
let processes = [];
let ganttChart;

// DOM Elements
const pidInput = document.getElementById('pid');
const arrivalInput = document.getElementById('arrival');
const burstInput = document.getElementById('burst');
const priorityInput = document.getElementById('priority');
const addProcessBtn = document.getElementById('addProcess');
const processTable = document.getElementById('processTable').querySelector('tbody');
const algorithmSelect = document.getElementById('algorithm');
const timeQuantumGroup = document.getElementById('timeQuantumGroup');
const timeQuantumInput = document.getElementById('timeQuantum');
const runSchedulerBtn = document.getElementById('runScheduler');
const clearAllBtn = document.getElementById('clearAll');
const ganttChartCanvas = document.getElementById('ganttChart');
const statsTable = document.getElementById('statsTable').querySelector('tbody');
const avgStatsText = document.getElementById('avgStats');

// Initialize Chart.js
let ganttChartInstance = null;

// Event Listeners
addProcessBtn.addEventListener('click', addProcess);
algorithmSelect.addEventListener('change', toggleTimeQuantum);
runSchedulerBtn.addEventListener('click', runScheduler);
clearAllBtn.addEventListener('click', clearAll);

// Add after the existing event listeners
priorityInput.addEventListener('input', function () {
    const value = parseInt(this.value);
    if (value > 20) {
        alert('Priority cannot exceed 20!');
        this.value = '20';
    }
});

// Tab functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tab.getAttribute('data-tab') + 'Tab').classList.add('active');
    });
});

// Functions
function addProcess() {
    const pid = parseInt(pidInput.value);
    const arrival = parseInt(arrivalInput.value);
    const burst = parseInt(burstInput.value);
    const priority = parseInt(priorityInput.value) || 0;

    // Validation
    if (!pid || isNaN(pid) || !arrival || isNaN(arrival) || !burst || isNaN(burst)) {
        alert('Please enter valid numerical values!');
        return;
    }

    // Check if PID already exists
    if (processes.some(p => p.pid === pid)) {
        alert('Process ID must be unique!');
        return;
    }

    // Check if priority is within valid range
    if (priority > 20) {
        alert('Priority cannot exceed 20!');
        return;
    }

    // Add process to array
    processes.push(new Process(pid, arrival, burst, priority));

    // Update table
    updateProcessTable();

    // Clear inputs
    pidInput.value = '';
    arrivalInput.value = '';
    burstInput.value = '';
    priorityInput.value = '0';

    // Focus on first input
    pidInput.focus();
}

function updateProcessTable() {
    // Clear table
    processTable.innerHTML = '';

    // Add rows
    processes.forEach((process, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
                    <td>${process.pid}</td>
                    <td>${process.arrival}</td>
                    <td>${process.burst}</td>
                    <td>${process.priority}</td>
                    <td><button class="delete-btn" data-index="${index}">Delete</button></td>
                `;

        processTable.appendChild(row);
    });

    // Add delete event listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            processes.splice(index, 1);
            updateProcessTable();
        });
    });
}

function toggleTimeQuantum() {
    if (algorithmSelect.value === 'RoundRobin') {
        timeQuantumGroup.style.display = 'block';
    } else {
        timeQuantumGroup.style.display = 'none';
    }
}

function fcfsScheduling(inputProcesses) {
    // Create deep copy of processes to avoid modifying originals
    const processes = JSON.parse(JSON.stringify(inputProcesses));

    // Sort by arrival time
    processes.sort((a, b) => a.arrival - b.arrival);

    let currentTime = 0;
    const ganttChart = [];

    processes.forEach(process => {
        if (currentTime < process.arrival) {
            currentTime = process.arrival;
        }

        process.waitingTime = currentTime - process.arrival;
        process.completionTime = currentTime + process.burst;
        process.turnaroundTime = process.completionTime - process.arrival;

        ganttChart.push({
            pid: process.pid,
            start: currentTime,
            end: process.completionTime
        });

        currentTime += process.burst;
    });

    return { processes, ganttChart };
}

function sjfScheduling(inputProcesses) {
    // Create deep copy of processes to avoid modifying originals
    const processes = JSON.parse(JSON.stringify(inputProcesses));

    // Sort by burst time, then by arrival time
    processes.sort((a, b) => {
        if (a.burst === b.burst) {
            return a.arrival - b.arrival;
        }
        return a.burst - b.burst;
    });

    return fcfsScheduling(processes);
}

function roundRobinScheduling(inputProcesses, timeQuantum) {
    // Create deep copy of processes to avoid modifying originals
    const processesCopy = JSON.parse(JSON.stringify(inputProcesses));
    let queue = [...processesCopy];
    let currentTime = 0;
    const ganttChart = [];

    // Sort initially by arrival time
    queue.sort((a, b) => a.arrival - b.arrival);

    // Keep track of completed processes
    const completedProcesses = [];
    const runningQueue = [];

    // Get earliest arrival time
    const earliestArrival = Math.min(...queue.map(p => p.arrival));
    currentTime = earliestArrival;

    // Add initial processes to running queue
    queue.filter(p => p.arrival <= currentTime).forEach(p => {
        runningQueue.push(p);
    });
    queue = queue.filter(p => p.arrival > currentTime);

    while (runningQueue.length > 0) {
        const process = runningQueue.shift();

        const executionTime = Math.min(timeQuantum, process.burst);

        ganttChart.push({
            pid: process.pid,
            start: currentTime,
            end: currentTime + executionTime
        });

        process.burst -= executionTime;
        currentTime += executionTime;

        // Add newly arrived processes to running queue
        queue.filter(p => p.arrival <= currentTime).forEach(p => {
            runningQueue.push(p);
        });
        queue = queue.filter(p => p.arrival > currentTime);

        if (process.burst > 0) {
            runningQueue.push(process);
        } else {
            // Process completed
            process.completionTime = currentTime;
            process.turnaroundTime = process.completionTime - process.arrival;
            process.waitingTime = process.turnaroundTime - process.originalBurst;
            completedProcesses.push(process);
        }
    }

    return { processes: completedProcesses, ganttChart };
}

function priorityScheduling(inputProcesses) {
    // Create deep copy of processes to avoid modifying originals
    const processes = JSON.parse(JSON.stringify(inputProcesses));

    // Validate priorities
    processes.forEach(process => {
        if (process.priority > 20) {
            process.priority = 20;
        }
    });

    // Lower priority number = higher priority
    processes.sort((a, b) => {
        if (a.priority === b.priority) {
            return a.arrival - b.arrival;
        }
        return a.priority - b.priority;
    });

    return fcfsScheduling(processes);
}

function runScheduler() {
    if (processes.length === 0) {
        alert('Please add at least one process!');
        return;
    }

    // Deep copy processes to avoid modifying originals
    const processesCopy = JSON.parse(JSON.stringify(processes));

    // Run selected algorithm
    let result;
    const algorithm = algorithmSelect.value;

    switch (algorithm) {
        case 'FCFS':
            result = fcfsScheduling(processesCopy);
            break;
        case 'SJF':
            result = sjfScheduling(processesCopy);
            break;
        case 'RoundRobin':
            const timeQuantum = parseInt(timeQuantumInput.value);
            if (!timeQuantum || timeQuantum < 1) {
                alert('Please enter a valid time quantum!');
                return;
            }
            result = roundRobinScheduling(processesCopy, timeQuantum);
            break;
        case 'Priority':
            result = priorityScheduling(processesCopy);
            break;
        default:
            alert('Algorithm not implemented!');
            return;
    }

    // Display results
    displayGanttChart(result.ganttChart, algorithm);
    displayStatistics(result.processes);
}

function displayGanttChart(ganttChart, algorithm) {
    // Prepare data for Chart.js
    const labels = [];
    const datasets = [];
    const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
        'rgba(40, 159, 64, 0.7)',
        'rgba(210, 199, 199, 0.7)'
    ];

    // Get max completion time for axis scale
    const maxTime = Math.max(...ganttChart.map(g => g.end));

    // Create dataset for each process
    const processIds = [...new Set(ganttChart.map(g => g.pid))];

    processIds.forEach((pid, index) => {
        const processSegments = ganttChart.filter(g => g.pid === pid);

        processSegments.forEach(segment => {
            datasets.push({
                label: `P${pid}`,
                data: [{
                    x: [segment.start, segment.end],
                    y: 'Processes'
                }],
                backgroundColor: colors[index % colors.length]
            });
        });
    });

    // Create chart
    if (ganttChartInstance) {
        ganttChartInstance.destroy();
    }

    ganttChartInstance = new Chart(ganttChartCanvas, {
        type: 'bar',
        data: {
            datasets: datasets
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    min: 0,
                    max: maxTime,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `${algorithm} Gantt Chart`
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const data = context.dataset.data[context.dataIndex];
                            return `${context.dataset.label}: ${data.x[0]} - ${data.x[1]}`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function displayStatistics(processes) {
    // Clear table
    statsTable.innerHTML = '';

    // Calculate averages
    let totalTurnaround = 0;
    let totalWaiting = 0;

    // Add rows
    processes.forEach(process => {
        const row = document.createElement('tr');

        row.innerHTML = `
                    <td>P${process.pid}</td>
                    <td>${process.completionTime}</td>
                    <td>${process.turnaroundTime}</td>
                    <td>${process.waitingTime}</td>
                `;

        statsTable.appendChild(row);

        totalTurnaround += process.turnaroundTime;
        totalWaiting += process.waitingTime;
    });

    // Display averages
    const avgTurnaround = totalTurnaround / processes.length;
    const avgWaiting = totalWaiting / processes.length;

    avgStatsText.textContent = `Average Turnaround Time: ${avgTurnaround.toFixed(2)} | Average Waiting Time: ${avgWaiting.toFixed(2)}`;
}

function clearAll() {
    processes = [];
    updateProcessTable();

    // Clear statistics
    statsTable.innerHTML = '';
    avgStatsText.textContent = '';

    // Clear chart
    if (ganttChartInstance) {
        ganttChartInstance.destroy();
        ganttChartInstance = null;
    }
}