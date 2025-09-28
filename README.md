# sunhacks_cocodrilo

Cocodrilo — a small demo site for Sunhacks 2025. The project provides a minimal chatbot UI that proxies requests to a Gemini-compatible model from the server (so the API key stays on the backend). The site also includes a tiny C2O footprint tracker for demo and educational purposes.

Files of interest
- `server.js` — Express server and proxy that forwards `/api/chat` to the Gemini endpoint configured via env.
- `public/index.html` — Static frontend.
- `public/styles.css` — Basic styles.
- `public/chat.js` — Frontend logic for chat and the toy C2O tracker.
- `.env.example` — Environment variables example.
- 

Quick start
1. Copy `.env.example` to `.env` and set `GEMINI_ENDPOINT` and `GEMINI_API_KEY`.

2. Install dependencies:

```bash
npm install
```

3. Start server:

```bash
npm start
```

4. Open http://localhost:3000

Security and production notes
- Never embed the API key in client-side code. Keep it in environment variables or a secret manager.
- Add authentication and rate limiting for a public deployment.

Development notes
- The proxy expects JSON and forwards it to `GEMINI_ENDPOINT` with a Bearer token from `GEMINI_API_KEY`.
- The request/response shape for Gemini providers varies. Adjust `server.js` and `public/chat.js` to match your provider's API.

Next steps (optional enhancements)
- Improve the C2O estimator with a real emissions dataset or integration.
- Add conversation state storage and UI improvements.
- Add tests and CI.

License
MIT
# sunhacks_cocodrilo
Sunhacks 2025
