/* ═══════════════════════════════════════════════
   review.js — Build the Step 3 review summary
   ═══════════════════════════════════════════════ */

/** Get trimmed value of an input by id */
function v(id) {
  return document.getElementById(id)?.value?.trim() || '';
}

function getSelectedSections() {
  return [...document.querySelectorAll('#sectionsGroup input:checked')]
    .map(x => x.value)
    .join(', ');
}

function buildReview() {
  const bots = [];
  if (selectedBots.cal)   bots.push('📅 Calendar Assistant');
  if (selectedBots.email) bots.push('✉️ Email Assistant');
  if (selectedBots.meet)  bots.push('📋 Meeting Summary');

  const googleStatus = googleConnected
    ? '<span style="color:var(--success-1)">✓ Connected</span>'
    : '<span style="color:var(--danger)">✗ Not connected</span>';

  const keyPreview = v('anthropicKey')
    ? v('anthropicKey').substring(0, 20) + '…'
    : '—';

  document.getElementById('reviewContent').innerHTML = `
    <strong>Name:</strong> ${v('fullName')} — ${v('businessName')}<br>
    <strong>Email:</strong> ${v('email')}<br>
    <strong>Phone:</strong> ${v('phone') || '—'}<br>
    <strong>Telegram ID:</strong> ${v('telegramId')}<br>
    <strong>Gmail:</strong> ${v('gmailAddress')}<br>
    <strong>Google:</strong> ${googleStatus}<br>
    <strong>Language:</strong> ${v('language')} &nbsp;|&nbsp; <strong>Tone:</strong> ${v('tone')}<br>
    <strong>Anthropic Key:</strong> ${keyPreview}<br>
    <strong>Bots Selected:</strong> ${bots.join(', ') || '<em>None</em>'}<br>
  `;
}

/* ── Bot toggle ───────────────────────────────── */
function toggleBot(bot) {
  selectedBots[bot] = !selectedBots[bot];
  const card = document.getElementById(bot + 'Card');
  card.classList.toggle('selected', selectedBots[bot]);
}

function togglePill(el) {
  el.classList.toggle('checked');
  el.querySelector('input').checked = el.classList.contains('checked');
}
