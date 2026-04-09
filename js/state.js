/* ═══════════════════════════════════════════════
   state.js — Shared application state
   ═══════════════════════════════════════════════ */

let currentStep = 1;
const totalSteps = 3;

const selectedBots = { cal: false, email: false, meet: false };

let googleConnected = false;
let clientId = 'client_' + Date.now();
