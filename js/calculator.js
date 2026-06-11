/* ═══════════════════════════════════════════════════════════
   VEDA JEWEL — Gold Exchange Calculator
   Interactive gold value estimator with elegant animations
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
});

function initCalculator() {
  const calculator = document.querySelector('#gold-calculator');
  if (!calculator) return;

  const metalSelect = calculator.querySelector('#metal-type');
  const weightInput = calculator.querySelector('#gold-weight');
  const resultDisplay = calculator.querySelector('#calc-result');
  const resultValue = calculator.querySelector('#calc-value');

  // Approximate gold rates (per gram) — for display purposes
  const rates = {
    '24k': 7200,
    '22k': 6600,
    '18k': 5400,
    '14k': 4200
  };

  function calculate() {
    const metalType = metalSelect?.value || '22k';
    const weight = parseFloat(weightInput?.value) || 0;
    const rate = rates[metalType] || 0;
    const value = Math.round(weight * rate);

    if (value > 0 && resultDisplay && resultValue) {
      resultDisplay.classList.add('active');
      animateValue(resultValue, value);
    } else if (resultDisplay) {
      resultDisplay.classList.remove('active');
    }
  }

  function animateValue(element, target) {
    const duration = 800;
    const startTime = performance.now();
    const startVal = parseInt(element.dataset.current) || 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (target - startVal) * eased);

      element.textContent = '₹ ' + current.toLocaleString('en-IN');
      element.dataset.current = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if (metalSelect) metalSelect.addEventListener('change', calculate);
  if (weightInput) {
    weightInput.addEventListener('input', calculate);
    weightInput.addEventListener('change', calculate);
  }
}
