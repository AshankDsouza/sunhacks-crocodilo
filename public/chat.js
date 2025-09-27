const form = document.getElementById('chat-form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

function appendMessage(text, cls='bot'){
  const el = document.createElement('div');
  el.className = 'msg ' + cls;
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  appendMessage(text, 'user');
  input.value = '';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    if (!res.ok) {
      const err = await res.text();
      appendMessage('Error: ' + err, 'bot');
      return;
    }

    const data = await res.json();
    // Try to find a text reply; adapt depending on your Gemini response shape.
    const reply = data.output || data.reply || JSON.stringify(data);
    appendMessage(reply, 'bot');
  } catch (err) {
    appendMessage('Network error', 'bot');
  }
});

// Simple local C2O tracker (toy estimator)
const actInput = document.getElementById('activity');
const addBtn = document.getElementById('add-activity');
const activities = document.getElementById('activities');
const c2oEl = document.getElementById('c2o');
let total = 0;

addBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const t = actInput.value.trim();
  if (!t) return;
  // naive parsing: look for miles or kWh or "meat" keywords
  let val = 0;
  const m = t.match(/(\d+(?:\.\d+)?)\s*(mi|mile|miles)/i);
  if (m) val = parseFloat(m[1]) * 0.25; // 0.25 kg per mile (toy)
  const k = t.match(/(\d+(?:\.\d+)?)\s*(kwh|kW?h)/i);
  if (k) val = Math.max(val, parseFloat(k[1]) * 0.5); // 0.5 kg per kWh (toy)
  if (/meat|beef|burger/i.test(t)) val = Math.max(val, 3);

  total += val;
  const li = document.createElement('li');
  li.textContent = `${t} — ${val.toFixed(2)} kg`;
  activities.appendChild(li);
  c2oEl.textContent = total.toFixed(2);
  actInput.value = '';
});
