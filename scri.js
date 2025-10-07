function applyHeader() {
  const operator = document.getElementById('operator').value.trim();
  const part = document.getElementById('part').value.trim();

  if (!operator || !part) {
    alert("Please enter both Operator and Part.");
    return;
  }

  document.getElementById('operator').disabled = true;
  document.getElementById('part').disabled = true;
}

// Store measurements and analyze
function storeMeasurements() {
  const operator = document.getElementById('operator').value.trim();
  const part = document.getElementById('part').value.trim();
  const rows = document.querySelectorAll('#measurementTable tbody tr');
  const data = [];

  rows.forEach((row, index) => {
    const measurementCell = row.querySelectorAll('td')[1];
    const measurement = parseFloat(measurementCell.textContent.trim());

    if (!isNaN(measurement)) {
      data.push({
        operator,
        part,
        trial: index + 1,
        measurement
      });
    }
  });



  const metrics = calculateGageRR(data);
  displayMetrics(metrics);
  renderGageChart(metrics);
}

// Gage R&R calculations
function calculateGageRR(data) {
  const partGroups = {};
  const operatorGroups = {};

  data.forEach(d => {
    if (!partGroups[d.part]) partGroups[d.part] = [];
    partGroups[d.part].push(d.measurement);

    if (!operatorGroups[d.operator]) operatorGroups[d.operator] = [];
    operatorGroups[d.operator].push(d.measurement);
  });

  const repeatability = averageVariance(partGroups);
  const reproducibility = averageVariance(operatorGroups);
  const totalVariation = variance(data.map(d => d.measurement));

  return { repeatability, reproducibility, totalVariation };
}

function averageVariance(groups) {
  let total = 0;
  let count = 0;
  for (const key in groups) {
    const values = groups[key];
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const varSum = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
    total += varSum / values.length;
    count++;
  }
  return total / count;
}

function variance(values) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
}
function exportChartAsImage() {
  const operator = document.getElementById('operator').value.trim();
  const part = document.getElementById('part').value.trim();
  const canvas = document.getElementById('gageChart');

  // Get the existing chart instance
  const chart = Chart.getChart('gageChart');
  if (chart) {
    // Update chart title with operator and part
    chart.options.plugins.title.text = `Gage R&R Variance Breakdown | Operator: ${operator}, Part: ${part}`;
    chart.update();
  }

  // Export chart as PNG
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `GageRR_${operator}_${part}.png`;
  link.click();
}

// Display metrics
function displayMetrics(metrics) {
  let resultBox = document.getElementById('results');
  if (!resultBox) {
    resultBox = document.createElement('div');
    resultBox.id = 'results';
    document.body.appendChild(resultBox);
  }

  resultBox.innerHTML = `
    <h2>Gage R&R Metrics</h2>
    <p><strong>Repeatability:</strong> ${metrics.repeatability.toFixed(4)}</p>
    <p><strong>Reproducibility:</strong> ${metrics.reproducibility.toFixed(4)}</p>
    <p><strong>Total Variation:</strong> ${metrics.totalVariation.toFixed(4)}</p>
    <canvas id="gageChart" width="400" height="200"></canvas>
  `;
}

// Render chart using Chart.js
function renderGageChart(metrics) {
  const ctx = document.getElementById('gageChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Repeatability', 'Reproducibility', 'Total Variation'],
      datasets: [{
        label: 'Variance',
        data: [
          metrics.repeatability,
          metrics.reproducibility,
          metrics.totalVariation
        ],
        backgroundColor: ['#3498db', '#e67e22', '#2ecc71']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Gage R&R Variance Breakdown'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
