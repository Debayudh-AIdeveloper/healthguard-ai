/**
   HealthGuard AI - Health Risk Prediction System
   Core Client Functionality - Form validations, BMIs, gauge animations and Chart.js integration
*/

document.addEventListener('DOMContentLoaded', function() {
  
  // 1. BMI Calculation Utility (Optional helper on predictable fields)
  const weightInput = document.getElementById('helper_weight');
  const heightInput = document.getElementById('helper_height');
  const bmiOutput = document.getElementById('bmi');
  
  if (weightInput && heightInput && bmiOutput) {
    const calculateBMI = () => {
      const weight = parseFloat(weightInput.value);
      const height = parseFloat(heightInput.value) / 100; // convert cm to m
      
      if (weight > 0 && height > 0) {
        const bmi = weight / (height * height);
        bmiOutput.value = bmi.toFixed(1);
      }
    };
    
    weightInput.addEventListener('input', calculateBMI);
    heightInput.addEventListener('input', calculateBMI);
  }
  
  // 2. Risk Meter Gauge SVG Animation (Result Screen)
  const gaugeFill = document.querySelector('.gauge-fill');
  if (gaugeFill) {
    const probability = parseFloat(gaugeFill.getAttribute('data-probability') || 0);
    // SVG circular path: circumference is 2 * PI * R (R=80 -> ~502)
    // Semi-circle gauge uses dashboard stroke arrays:
    const radius = 80;
    const circumference = Math.PI * radius; // 251.3
    
    // Convert probability (0-100) to dashoffset
    // Full scale (100% risk) translates to 0 offset, 0% risk is full circumference offset
    const percentage = Math.min(Math.max(probability, 0), 100);
    const offset = circumference - (percentage / 100) * circumference;
    
    // Delay slightly for smooth aesthetic entrance
    setTimeout(() => {
      gaugeFill.style.strokeDasharray = `${circumference} ${circumference}`;
      gaugeFill.style.strokeDashoffset = offset;
    }, 150);
  }

  // 3. Form Input Boundary/Value Validations
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      let hasError = false;
      const inputs = form.querySelectorAll('input[type="number"]');
      
      inputs.forEach(input => {
        // Clear previous custom error borders
        input.style.borderColor = '';
        
        const val = parseFloat(input.value);
        if (isNaN(val)) {
          // If required
          if (input.hasAttribute('required')) {
            input.style.borderColor = '#ef4444';
            hasError = true;
          }
        } else if (val < 0) {
          input.style.borderColor = '#ef4444';
          hasError = true;
        }
      });
      
      if (hasError) {
        e.preventDefault();
        alert('Please review the input form. All parameters must represent non-negative numeric parameters.');
      }
    });
  }
  
  // 4. Initialize Charts (Dashboard Screen) via globally available Chart.js
  const classChartCtx = document.getElementById('classDistChart');
  const importanceChartCtx = document.getElementById('importanceChart');
  
  if (classChartCtx && typeof Chart !== 'undefined') {
    new Chart(classChartCtx, {
      type: 'doughnut',
      data: {
        labels: ['Diabetic Outcome (positive)', 'Control Class (negative)'],
        datasets: [{
          data: [268, 500],
          backgroundColor: ['#EF4444', '#22C55E'],
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
  
  if (importanceChartCtx && typeof Chart !== 'undefined') {
    // Acquire features metrics list injected in dataset statistics attributes
    const importanceValues = JSON.parse(importanceChartCtx.getAttribute('data-values') || '[1.25, 3.82, -0.85, 0.12, -0.05, 2.76, 1.95, 0.98]');
    const featureLabels = ['Pregnancies', 'Glucose', 'Blood Pressure', 'Skin Thickness', 'Insulin', 'BMI', 'Genetic Pedigree', 'Age'];
    
    new Chart(importanceChartCtx, {
      type: 'bar',
      data: {
        labels: featureLabels,
        datasets: [{
          label: 'Prediction Coefficient Weights (Beta Value)',
          data: importanceValues,
          backgroundColor: importanceValues.map(v => v >= 0 ? '#3B82F6' : '#EF4444'),
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            grid: { display: true },
            title: { display: true, text: 'Clinical Weight Score' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
});
