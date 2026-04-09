/* ═══════════════════════════════════════════════
   oauth.js — Google OAuth flow
   ═══════════════════════════════════════════════ */

function updateGoogleBtn() {
  const gmail = v('gmailAddress');
  const btn = document.getElementById('googleConnectBtn');
  btn.disabled = !gmail;
}

async function connectGoogle() {
  const gmail = v('gmailAddress');
  if (!gmail) { showToast('Please enter your Gmail address first'); return; }

  const btn = document.getElementById('googleConnectBtn');
  btn.textContent = 'Saving data...';
  btn.disabled = true;
  await saveClientData();

  btn.textContent = 'Opening Google...';

  try {
    const res = await fetch(`${BACKEND_URL}/oauth/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, gmailAddress: gmail })
    });

    const data = await res.json();
    if (!data.ok) {
      showToast('Error: ' + (data.error || 'Failed to start Google auth'));
      btn.disabled = false;
      btn.textContent = '🔗 Connect Google Account';
      return;
    }

    window.open(data.authUrl, 'google_auth', 'width=500,height=650,left=200,top=100');
    btn.disabled = false;
    btn.textContent = '⏳ Waiting for Google...';
  } catch (err) {
    showToast('Network error: ' + err.message);
    btn.disabled = false;
    btn.textContent = '🔗 Connect Google Account';
  }
}

// Listen for OAuth success from popup
window.addEventListener('message', (event) => {
  if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
    googleConnected = true;

    const btn = document.getElementById('googleConnectBtn');
    btn.textContent = '✅ Google Connected!';
    btn.classList.add('connected');
    btn.disabled = false;

    const status = document.getElementById('googleStatus');
    status.textContent = '✓ Connected as: ' + v('gmailAddress');
    status.style.color = 'var(--success-1)';
  }
});
