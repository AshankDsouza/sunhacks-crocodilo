const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// In-memory storage for conversations (use database in production)
const conversations = new Map();

app.post('/api/chat', async (req, res) => {
  const { message, conversationId, conversation } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const ai = new GoogleGenerativeAI("AIzaSyAE-aiX46n64Go_CkRmDtXRJO0De6MGc0A");
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Get or create conversation history
    const sessionId = conversationId || 'default';
    let chatHistory = conversations.get(sessionId) || [];
    
    // If conversation array is provided in request, use that instead
    if (conversation && Array.isArray(conversation)) {
      chatHistory = conversation;
    }

    // Build the full conversation context
    let fullPrompt = '';
    
    // Add previous conversation context
    if (chatHistory.length > 0) {
      fullPrompt += "Previous conversation:\n";
      chatHistory.forEach(msg => {
        if (msg.role === 'user') {
          fullPrompt += `User: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          fullPrompt += `Assistant: ${msg.content}\n`;
        }
      });
      fullPrompt += '\n';
    }
    
    // Add current message
    fullPrompt += `User: ${message}\nAssistant:`;

    console.log('Full prompt being sent:', fullPrompt);

    // Generate response with full context
    const response = await model.generateContent(fullPrompt);
    
    const text = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || 
                 "No response generated.";

    // Update conversation history
    chatHistory.push({ role: 'user', content: message });
    chatHistory.push({ role: 'assistant', content: text });
    
    // Store updated conversation (limit to last 20 messages to prevent memory issues)
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(-20);
    }
    conversations.set(sessionId, chatHistory);

    console.log('Generated response:', text);
    
    res.json({
      reply: text,
      conversationId: sessionId,
      conversation: chatHistory
    });

  } catch (err) {
    console.error('Chat proxy error:', err);
    res.status(500).json({ error: 'proxy error' });
  }
});

// Optional: Get conversation history
app.get('/api/conversation/:id', (req, res) => {
  const conversationId = req.params.id;
  const history = conversations.get(conversationId) || [];
  res.json({ conversation: history });
});

// Optional: Clear conversation history
app.delete('/api/conversation/:id', (req, res) => {
  const conversationId = req.params.id;
  conversations.delete(conversationId);
  res.json({ message: 'Conversation cleared' });
});

// Optional: List all active conversations
app.get('/api/conversations', (req, res) => {
  const activeConversations = Array.from(conversations.keys());
  res.json({ conversations: activeConversations });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});