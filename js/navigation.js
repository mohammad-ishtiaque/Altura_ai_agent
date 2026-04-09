/* ═══════════════════════════════════════════════
   navigation.js — Step navigation & progress
   ═══════════════════════════════════════════════ */

function goStep(step) {
  if (step > currentStep && !validateStep(currentStep)) return;

  const prevCard = document.getElementById('step' + currentStep);
  prevCard.style.opacity = '0';
  prevCard.style.transform = step > currentStep ? 'translateX(-24px)' : 'translateX(24px)';

  setTimeout(() => {
    prevCard.classList.remove('active');
    prevCard.style.opacity = '';
    prevCard.style.transform = '';

    currentStep = step;
    const nextCard = document.getElementById('step' + currentStep);
    nextCard.style.opacity = '0';
    nextCard.style.transform = step > 1 ? 'translateX(24px)' : 'translateX(-24px)';
    nextCard.classList.add('active');

    requestAnimationFrame(() => {
      nextCard.style.transition = 'opacity 300ms ease, transform 300ms ease';
      nextCard.style.opacity = '1';
      nextCard.style.transform = 'translateX(0)';
    });

    if (step === 3) buildReview();
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 180);
}

function updateProgress() {
  const pct = Math.round(((currentStep - 1) / totalSteps) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('stepPct').textContent = pct + '%';

  const labels = [
    'Step 1 of 3 — Client Information',
    'Step 2 of 3 — Bot Configuration',
    'Step 3 of 3 — Review & Submit',
  ];
  document.getElementById('stepLabel').textContent = labels[currentStep - 1];

  for (let i = 0; i < totalSteps; i++) {
    const dot = document.getElementById('dot' + i);
    dot.className = 'step-dot';
    if (i + 1 === currentStep) dot.classList.add('active');
    else if (i + 1 < currentStep) dot.classList.add('done');
  }
}
