# 🤖 Mini Chatbot — Mia

A simple chatbot built with Node.js + Express + OpenRouter API, created to learn the core concepts of LLMs and AI Agents.

## Concepts Demonstrated

| Concept | Implementation |
|---|---|
| **Model** | LLM calls via OpenRouter API |
| **Instructions** | System prompt defines name, behavior, and language |
| **Short-term Memory** | `chat_history` stored on client, sent with every request |
| **Tool (Function)** | Keyword detection → `get_current_time()` returns real time |
| **RAG** | Splits knowledge base into chunks, finds relevant ones per query |

## Project Structure

```
mini-chatbot/
├── .env                    ← API key (do not commit to git)
├── package.json
├── backend/
│   ├── server.js           ← Express backend + LLM logic
│   └── rag.js              ← Chunking + keyword search
├── data/
│   └── knowledge.txt       ← Knowledge base (plain text)
└── frontend/
    └── index.html          ← Chat UI
```

## Setup

### 1. Install dependencies

```bash
mkdir mini-chatbot && cd mini-chatbot
npm init -y
npm install express dotenv
```

### 2. Create `.env` file

```
OPENROUTER_API_KEY=sk-or-v1-...
```

Get a free API key at [openrouter.ai/keys](https://openrouter.ai/keys).

### 3. Add your knowledge base
 
Edit `data/knowledge.txt` with any content you want Mia to know about.
Each paragraph (separated by a blank line) becomes one chunk.

### 4. Run the server

```bash
node server.js
```

Open your browser at **http://localhost:3000**

## Testing Each Concept

| Message | Concept tested |
|---|---|
| "what is your name?" | Instructions / System prompt |
| "what did I just ask?" | Short-term Memory |
| "what time is it?" | Tool / Function |
| Ask about knowledge.txt content | RAG + Semantic Search |


## How RAG Works
 
### v1 — Keyword Matching (`rag.js`)
Splits text into chunks and counts word overlap with the query.
Fast but fails when query and knowledge use different words or languages.
The top matching chunks are injected into the system prompt so the LLM can answer based on your data.
 
> **Limitation:** keyword matching fails when the query and knowledge use different words or languages. Next step: upgrade to embedding-based semantic search.

## Configuration

Change the model in `backend/server.js`:
 
```js
const MODEL = 'openai/gpt-oss-20b:free';
```
 
Recommended free models on OpenRouter (as of July 2026):
- `openai/gpt-oss-20b:free` — best overall free model
- `meta-llama/llama-3.3-70b-instruct:free` — strong multilingual support
Check the current free model list at [openrouter.ai/models](https://openrouter.ai/models).
Free model availability changes frequently — verify before use.


## Next Steps
 
- [x] Basic LLM chatbot with system prompt
- [x] Short-term memory via chat history
- [x] Tool: get current time
- [x] RAG with keyword matching
- [ ] RAG with semantic embedding search
- [ ] Real function calling (model decides when to call tools)
- [ ] Deploy to Render or Railway
