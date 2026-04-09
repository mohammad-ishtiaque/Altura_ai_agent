/* ═══════════════════════════════════════════════
   validation.js — Per-step form validation
   ═══════════════════════════════════════════════ */

function validateStep(step) {
  if (step === 1) {
    const fields = [
      { id: 'fullName',     label: 'Full Name' },
      { id: 'businessName', label: 'Business Name' },
      { id: 'email',        label: 'Email Address' },
      { id: 'language',     label: 'Preferred Language' },
      { id: 'tone',         label: 'Bot Communication Tone' },
      { id: 'telegramId',   label: 'Telegram ID' },
      { id: 'anthropicKey', label: 'Anthropic API Key' },
      { id: 'gmailAddress', label: 'Gmail Address' },
    ];

    for (const f of fields) {
      const el = document.getElementById(f.id);
      if (!el || !el.value.trim()) {
        el?.focus();
        if (el) {
          el.classList.add('field-error');
          setTimeout(() => el.classList.remove('field-error'), 2500);
        }
        showToast(f.label + ' is required.');
        return false;
      }
    }

    if (!oauthFile) {
      showToast('Please upload your client_secret.json file.');
      return false;
    }
    if (!googleConnected) {
      showToast('Please connect your Google account first.');
      return false;
    }
  }

  if (step === 2) {
    if (!selectedBots.cal && !selectedBots.email && !selectedBots.meet) {
      showToast('Please select at least one bot.');
      return false;
    }
  }

  return true;
}

/* ── Toast notification (replaces alert) ─────── */
function showToast(msg) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #1a1e2a;
    color: #f87171;
    border: 1px solid rgba(248,113,113,0.3);
    border-radius: 10px;
    padding: 12px 22px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    z-index: 9999;
    transition: opacity 300ms ease, transform 300ms ease;
    opacity: 0;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
