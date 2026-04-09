/* ═══════════════════════════════════════════════
   submit.js — Save client data & deploy bots
   ═══════════════════════════════════════════════ */

async function saveClientData() {
  const data = {
    clientId,
    name:            v('fullName'),
    email:           v('email'),
    phone:           v('phone'),
    businessName:    v('businessName'),
    language:        v('language'),
    tone:            v('tone'),
    telegramId:      v('telegramId'),
    timezone:        v('timezone') || 'America/Bogota',
    anthropicKey:    v('anthropicKey'),
    emailToken:      v('emailBotToken'),
    calendarToken:   v('calendarBotToken'),
    meetingToken:    v('meetingBotToken'),
    gmailAddress:    v('gmailAddress'),
  };

  await fetch(`${BACKEND_URL}/client/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

async function submitForm() {
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = '🚀 Deploying your bots...';

  try {
    await saveClientData();

    const deployRes = await fetch(`${BACKEND_URL}/deploy/${clientId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const deployData = await deployRes.json();
    if (!deployData.ok) throw new Error(deployData.error || 'Deployment failed');

    // ── Show success state ────────────────────
    document.getElementById('step3').style.display = 'none';
    document.getElementById('successCard').style.display = 'block';
    document.getElementById('successEmail').textContent  = v('email');
    document.getElementById('progressFill').style.width  = '100%';
    document.getElementById('stepPct').textContent       = '100%';
    document.getElementById('stepLabel').textContent     = '✅ Complete!';
    document.querySelectorAll('.step-dot').forEach(d => { d.className = 'step-dot done'; });

  } catch (err) {
    const errEl = document.getElementById('errorMsg');
    errEl.style.display = 'block';
    errEl.textContent   = 'Error: ' + err.message;
    btn.disabled        = false;
    btn.textContent     = '🚀 Submit Setup Request';
  }
}
