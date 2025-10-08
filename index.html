<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Gage R&R Tool</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- External CSS -->
  <link rel="stylesheet" href="sty.css">
  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

  <!-- Chart.js Library -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <style>
    /* Optional fallback styling */
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background-color: #f4f6f8;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 20px;
      background-color: white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: center;
    }
    input[type="text"] {
      padding: 8px;
      margin-right: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }
    button {
      padding: 8px 16px;
      margin: 5px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    button:hover {
      background-color: #2980b9;
    }
    #results {
      margin-top: 30px;
      padding: 20px;
      background-color: #eaf2f8;
      border-left: 5px solid #3498db;
      border-radius: 6px;
    }
    canvas {
      margin-top: 30px;
    }
  </style>
</head>
<body>

  <h1>Gage R&R Tool</h1>

  <!-- Operator Input -->
  <label for="operatorName">Operator Name:</label>
  <input type="text" id="operatorName" placeholder="Enter operator name">
  <button onclick="addOperatorColumn()">Add Operator</button>
  <button onclick="addTrialRow()">Add Trial</button>
  <div style="margin-top: 20px; padding: 10px; background-color: #f4f6f8; border-radius: 6px;">
  <h3>Measurement Settings</h3>
  <label for="nominalInput">Nominal Value:</label>
  <input type="number" id="nominalInput" step="0.01" placeholder="e.g. 10.00">

  <label for="toleranceInput" style="margin-left: 20px;">Tolerance (±):</label>
  <input type="number" id="toleranceInput" step="0.01" placeholder="e.g. 0.25">
</div>


  <!-- Measurement Table -->
  <table id="measurementTable">
    <thead>
      <tr id="headerRow">
        <th>Trial #</th>
      </tr>
    </thead>
    <tbody id="tableBody">
      <!-- Rows will be added dynamically -->
    </tbody>
  </table>

  <!-- Results and Charts -->
  <button onclick="calculateReproducibility()">Calculate Reproducibility</button>
  <section id="resultsSection">
    <h2>Results</h2>
  <div id="results"></div>
  
  </section>


  <canvas id="repeatabilityChart" width="600" height="300"></canvas>
  <canvas id="reproducibilityChart" width="600" height="300"></canvas>
<section id="gageExplanation" style="margin-top: 30px; background-color: #f9f9f9; padding: 20px; border-left: 5px solid #3498db; border-radius: 6px;">
  <h2>Understanding Gage R&R</h2>

  <h3>🔁 Repeatability</h3>
  <p>
    Repeatability refers to the variation in measurements taken by the same operator using the same instrument on the same part. It shows how consistent an operator is when repeating the measurement under identical conditions.
  </p>
  <p><strong>Formula:</strong></p>
  <p>
    $$ \text{Repeatability Variance} = \frac{1}{n} \sum_{i=1}^{n} (x_i - \bar{x})^2 $$
  </p>
  <p>
    where \( x_i \) are the measurements by one operator, and \( \bar{x} \) is the mean of those measurements.
  </p>

  <h3>👥 Reproducibility</h3>
  <p>
    Reproducibility measures the variation in measurements between different operators. It reflects how consistent the measurement system is across multiple users.
  </p>
  <p><strong>Formula:</strong></p>
  <p>
    $$ \text{Reproducibility Variance} = \frac{1}{m} \sum_{j=1}^{m} (\bar{x}_j - \bar{x}_{\text{overall}})^2 $$
  </p>
  <p>
    where \( \bar{x}_j \) is the mean for each operator, and \( \bar{x}_{\text{overall}} \) is the grand mean across all operators.
  </p>

  <h3>📊 Total Variation</h3>
  <p>
    Total variation is the overall variance in all measurements, combining both repeatability and reproducibility.
  </p>
  <p><strong>Formula:</strong></p>
  <p>
    $$ \text{Total Variation} = \frac{1}{N} \sum_{k=1}^{N} (x_k - \bar{x}_{\text{overall}})^2 $$
  </p>
  <p>
    where \( x_k \) are all measurements from all operators.
  </p>
</section>
<section id="interpretationScale" style="margin-top: 30px;">
  <h2>📏 Gage R&R Interpretation Scale</h2>
  <table class="scale-table">
    <thead>
      <tr>
        <th>% of Total Variation</th>
        <th>Quality Level</th>
        <th>Interpretation</th>
        <th>Color Code</th>
      </tr>
    </thead>
    <tbody>
      <tr class="excellent">
        <td>0% – 10%</td>
        <td>✅ Excellent</td>
        <td>Measurement system is highly reliable</td>
        <td>🟢 Green</td>
      </tr>
      <tr class="acceptable">
        <td>10% – 30%</td>
        <td>👍 Acceptable</td>
        <td>Generally acceptable for most applications</td>
        <td>🟡 Yellow</td>
      </tr>
      <tr class="marginal">
        <td>30% – 50%</td>
        <td>⚠️ Marginal</td>
        <td>May be usable but needs improvement</td>
        <td>🟠 Orange</td>
      </tr>
      <tr class="poor">
        <td>> 50%</td>
        <td>❌ Poor</td>
        <td>Measurement system is inconsistent and unreliable</td>
        <td>🔴 Red</td>
      </tr>
    </tbody>
  </table>
</section>

  <!-- External JavaScript -->
  <script src="scri.js"></script>
</body>
</html>
