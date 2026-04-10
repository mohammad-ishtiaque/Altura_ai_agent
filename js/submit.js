/* ═══════════════════════════════════════════════
   submit.js — Save client data & deploy bots
   ═══════════════════════════════════════════════ */

async function saveClientData() {
  const data = {
    clientId,
    name:          v('fullName'),
    email:         v('email'),
    phone:         v('phone'),
    businessName:  v('businessName'),
    language:      v('language'),
    tone:          v('tone'),
    telegramId:    v('telegramId'),
    timezone:      v('timezone') || 'America/Bogota',
    anthropicKey:  v('anthropicKey'),
    emailToken:    v('emailBotToken'),
    calendarToken: v('calendarBotToken'),
    meetingToken:  v('meetingBotToken'),
    gmailAddress:  v('gmailAddress'),
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

    // Fire deploy request but don't wait for it to finish
    // Backend responds immediately, deployment runs in background
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const deployRes = await fetch(`${BACKEND_URL}/deploy/${clientId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const deployData = await deployRes.json();
      if (!deployData.ok) throw new Error(deployData.error || 'Deployment failed');
    } catch (fetchErr) {
      clearTimeout(timeout);
      // If timeout or network error, still show success
      // because backend is deploying in background
      if (fetchErr.name !== 'AbortError' && !fetchErr.message.includes('fetch')) {
        throw fetchErr;
      }
      console.log('Deploy running in background...');
    }

    // Show success state
    document.getElementById('step3').style.display = 'none';
    document.getElementById('successCard').style.display = 'block';
    document.getElementById('progressFill').style.width  = '100%';
    document.getElementById('stepPct').textContent       = '100%';
    document.getElementById('stepLabel').textContent     = '✅ Complete!';
    document.querySelectorAll('.step-dot').forEach(d => { d.className = 'step-dot done'; });

    // Update success card content
    document.getElementById('successCard').innerHTML = `
      <div class="success-icon">🚀</div>
      <h2>Your Bots Are Being Deployed!</h2>
      <p>
        Your AI assistants are starting up in the background.<br><br>
        <strong>Wait 3-4 minutes</strong> then open Telegram and send <strong>"hi"</strong> to your bots.<br><br>
        A confirmation will be sent to <strong>${v('email')}</strong>.<br><br>
        <span style="color:var(--text-muted);font-size:13px">If bots don't respond after 5 minutes, contact support.</span>
      </p>
    `;

  } catch (err) {
    const errEl = document.getElementById('errorMsg');
    errEl.style.display = 'block';
    errEl.textContent   = 'Error: ' + err.message;
    btn.disabled        = false;
    btn.textContent     = '🚀 Submit Setup Request';
  }
}