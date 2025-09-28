const form = document.getElementById('chat-form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Conversation memory variables
let conversationId = null;
let conversationHistory = [];

// Generate a unique conversation ID for this session
function generateConversationId() {
  return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Initialize conversation ID when page loads
if (!conversationId) {
  conversationId = generateConversationId();
  console.log('Started new conversation:', conversationId);
}

function appendMessage(text, cls='bot'){
  const el = document.createElement('div');
  el.className = 'msg ' + cls;
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

// Add function to clear conversation
function clearConversation() {
  // Clear UI
  messages.innerHTML = '';
  
  // Reset conversation data
  conversationId = generateConversationId();
  conversationHistory = [];
  
  // Optionally clear on server (uncomment if you want to clean up server memory)
  // fetch(`/api/conversation/${conversationId}`, { method: 'DELETE' });
  
  console.log('Started new conversation:', conversationId);
  appendMessage('Conversation cleared. Starting fresh!', 'bot');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  
  appendMessage(text, 'user');
  input.value = '';

  // Show typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'msg bot typing';
  typingEl.textContent = 'Thinking...';
  messages.appendChild(typingEl);
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: text,
        conversationId: conversationId,
        conversation: conversationHistory // Send current conversation history
      })
    });

    // Remove typing indicator
    messages.removeChild(typingEl);

    if (!res.ok) {
      const err = await res.text();
      appendMessage('Error: ' + err, 'bot');
      return;
    }

    const data = await res.json();
    
    // Update conversation history from server response
    if (data.conversation) {
      conversationHistory = data.conversation;
    }
    
    // Update conversation ID if server provided one
    if (data.conversationId) {
      conversationId = data.conversationId;
    }
    
    const reply = data.reply || data.output || JSON.stringify(data);
    appendMessage(reply, 'bot');
    
    console.log('Conversation updated. Messages in history:', conversationHistory.length);
    
  } catch (err) {
    // Remove typing indicator on error
    if (messages.contains(typingEl)) {
      messages.removeChild(typingEl);
    }
    appendMessage('Network error', 'bot');
    console.error('Chat error:', err);
  }
});

// Add keyboard shortcuts
input.addEventListener('keydown', (e) => {
  // Ctrl+L or Cmd+L to clear conversation
  if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
    e.preventDefault();
    clearConversation();
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

// Optional: Add a clear conversation button to your HTML and connect it
// Example: document.getElementById('clear-chat')?.addEventListener('click', clearConversation);

// Optional: Load conversation history on page load (if you want persistence across page refreshes)
async function loadConversationHistory() {
  try {
    const res = await fetch(`/api/conversation/${conversationId}`);
    if (res.ok) {
      const data = await res.json();
      conversationHistory = data.conversation || [];
      
      // Optionally display the history in the UI
      conversationHistory.forEach(msg => {
        if (msg.role === 'user') {
          appendMessage(msg.content, 'user');
        } else if (msg.role === 'assistant') {
          appendMessage(msg.content, 'bot');
        }
      });
      
      console.log('Loaded conversation history:', conversationHistory.length, 'messages');
    }
  } catch (err) {
    console.log('Could not load conversation history:', err);
  }
}

// Uncomment the next line if you want to load conversation history on page load
// loadConversationHistory();