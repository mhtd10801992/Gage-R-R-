let operatorList = [];
let trialCount = 0;

function addOperatorColumn() {
  const name = document.getElementById('operatorName').value.trim();
  if (!name) return alert("Please enter an operator name.");
  if (operatorList.includes(name)) return alert("Operator already added.");

  operatorList.push(name);

  const headerRow = document.getElementById('headerRow');
  const th = document.createElement('th');
  th.textContent = name;
  headerRow.appendChild(th);

  const rows = document.querySelectorAll('#tableBody tr');
  rows.forEach(row => {
    const td = document.createElement('td');
    td.contentEditable = true;
    row.appendChild(td);
  });

  document.getElementById('operatorName').value = '';
}

function addTrialRow() {
  trialCount++;
  const row = document.createElement('tr');
  const trialCell = document.createElement('td');
  trialCell.textContent = trialCount;
  row.appendChild(trialCell);

  operatorList.forEach(() => {
    const td = document.createElement('td');
    td.contentEditable = true;
    row.appendChild(td);
  });

  document.getElementById('tableBody').appendChild(row);
}

function enableEnterToAddRow() {
  const tableBody = document.getElementById('tableBody');

  tableBody.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      const cell = event.target;
      const row = cell.parentElement;
      const allRows = Array.from(tableBody.rows);
      const isLastRow = row === allRows[allRows.length - 1];
      const isLastCell = cell.cellIndex === row.cells.length - 1;

      if (isLastRow && isLastCell) {
        event.preventDefault();
        addTrialRow();
        setTimeout(() => {
          const newRow = tableBody.rows[tableBody.rows.length - 1];
          newRow.cells[1].focus();
        }, 0);
      }
    }
  });
}

function enableArrowKeyNavigation() {
  const tableBody = document.getElementById('tableBody');

  tableBody.addEventListener('keydown', function (event) {
    const cell = event.target;
    if (cell.tagName !== 'TD' || !cell.isContentEditable) return;

    const row = cell.parentElement;
    const rowIndex = Array.from(tableBody.rows).indexOf(row);
    const cellIndex = cell.cellIndex;

    let targetCell;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        targetCell = row.cells[cellIndex + 1];
        break;
      case 'ArrowLeft':
        event.preventDefault();
        targetCell = row.cells[cellIndex - 1];
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (rowIndex + 1 < tableBody.rows.length) {
          targetCell = tableBody.rows[rowIndex + 1].cells[cellIndex];
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (rowIndex > 0) {
          targetCell = tableBody.rows[rowIndex - 1].cells[cellIndex];
        }
        break;
    }

    if (targetCell && targetCell.isContentEditable) {
      targetCell.focus();
    }
  });
}

function calculateReproducibility() {
  const nominal = parseFloat(document.getElementById('nominalInput').value);
  const tolerance = parseFloat(document.getElementById('toleranceInput').value);

  if (isNaN(nominal) || isNaN(tolerance)) {
    alert("Please enter both nominal value and tolerance.");
    return;
  }

  const rows = document.querySelectorAll('#tableBody tr');
  const operatorData = {};
  operatorList.forEach(name => operatorData[name] = []);

  // Map operator names to column indexes
  const headerCells = document.querySelectorAll('#headerRow th');
  const operatorIndexes = {};
  operatorList.forEach(name => {
    headerCells.forEach((cell, i) => {
      if (cell.textContent === name) {
        operatorIndexes[name] = i;
      }
    });
  });

  // Collect measurements
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    operatorList.forEach(name => {
      const index = operatorIndexes[name];
      const val = parseFloat(cells[index]?.textContent.trim());
      if (!isNaN(val)) operatorData[name].push(val);
    });
  });

  // Calculate repeatability and reproducibility
  const repeatabilityResults = [];
  const operatorMeans = [];

  operatorList.forEach(name => {
    const data = operatorData[name];
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    operatorMeans.push(mean);

    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    repeatabilityResults.push({ name, variance });
  });

  const overallMean = operatorMeans.reduce((a, b) => a + b, 0) / operatorMeans.length;
  const reproducibility = operatorMeans.reduce((sum, val) => sum + Math.pow(val - overallMean, 2), 0) / operatorMeans.length;

  // Tolerance comparison
  const stdDev = Math.sqrt(reproducibility);
  const totalToleranceRange = tolerance * 2;
  const percentOfTolerance = ((6 * stdDev) / totalToleranceRange) * 100;

  let interpretation = '';
  if (percentOfTolerance < 10) {
    interpretation = '✅ Excellent — measurement system is highly precise.';
  } else if (percentOfTolerance < 30) {
    interpretation = '👍 Acceptable — usable with confidence.';
  } else if (percentOfTolerance < 50) {
    interpretation = '⚠️ Marginal — may need improvement.';
  } else {
    interpretation = '❌ Poor — not suitable for tight tolerances.';
  }

  // Display results
  document.getElementById('results').innerHTML = `
    <h3>Gage R&R Results</h3>
    <h4>Repeatability (per operator):</h4>
    <ul>
      ${repeatabilityResults.map(r => `<li><strong>${r.name}:</strong> ${r.variance.toFixed(4)}</li>`).join('')}
    </ul>
    <h4>Reproducibility:</h4>
    <p><strong>Variance between operator means:</strong> ${reproducibility.toFixed(4)}</p>
    <h4>📏 Tolerance Comparison</h4>
    <p><strong>Nominal Value:</strong> ${nominal}</p>
    <p><strong>Standard Deviation:</strong> ${stdDev.toFixed(4)}</p>
    <p><strong>% of Tolerance Consumed:</strong> ${percentOfTolerance.toFixed(2)}%</p>
    <p><strong>Interpretation:</strong> ${interpretation}</p>
  `;

  renderRepeatabilityChart(repeatabilityResults);
  renderReproducibilityChart(reproducibility);
}

function renderRepeatabilityChart(data) {
  const canvas = document.getElementById('repeatabilityChart');
  if (Chart.getChart(canvas)) Chart.getChart(canvas).destroy();

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.name),
      datasets: [{
        label: 'Repeatability Variance',
        data: data.map(d => d.variance),
        backgroundColor: '#3498db'
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Repeatability per Operator'
        },
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function renderReproducibilityChart(value) {
  const canvas = document.getElementById('reproducibilityChart');
  if (Chart.getChart(canvas)) Chart.getChart(canvas).destroy();

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Reproducibility'],
      datasets: [{
        label: 'Variance Between Operators',
        data: [value],
        backgroundColor: '#e67e22'
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Reproducibility Across Operators'
        },
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

window.onload = () => {
  enableEnterToAddRow();
  enableArrowKeyNavigation();
};
