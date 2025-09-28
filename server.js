const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI client


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

//Using gemini import instead of env file that was previously deleted.

// const GEMINI_ENDPOINT = process.env.GEMINI_ENDPOINT; // e.g., https://api.example.com/v1/chat:send
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// if (!GEMINI_ENDPOINT || !GEMINI_API_KEY) {
//   console.warn('GEMINI_ENDPOINT or GEMINI_API_KEY not set. Chat endpoint will fail until configured.');
// }


app.post('/api/chat', async (req, res) => {
  const { message, conversation } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  try {
    const payload = {
      // This payload is intentionally generic; adapt to your Gemini-compatible API shape.
      input: message,
      conversation: conversation || null
    };

    const ai = new GoogleGenerativeAI("AIzaSyAE-aiX46n64Go_CkRmDtXRJO0De6MGc0A");

    console.log({ai});
 const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Call the model
    const response = await model.generateContent(message);
    console.log('Gemini response', response);

    // convert response to json
    // Note: Uncomment and adapt the following lines based on your actual API response structure.
    // const data = response; // await response.json();
    const text =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    // const candidates = data.candidates || [];
    // console.log({candidates});

    console.log(text)
    
    

    // if (!response.ok) {
    //   const text = await response.text();
    //   return res.status(response.status).json({ error: text });
    // }

    
    res.json({reply:text});
  } catch (err) {
    console.error('Chat proxy error', err);
    res.status(500).json({ error: 'proxy error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
