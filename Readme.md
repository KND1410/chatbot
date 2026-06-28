# 🤖 Mini Chatbot — Mia

A simple chatbot built with Node.js + Express + OpenRouter API, created to learn the core concepts of LLMs and AI Agents.

## Concepts Demonstrated

| Concept | Implementation |
|---|---|
| **Model** | Calls LLM via OpenRouter API |
| **Instructions** | System prompt defines name, behavior, and language |
| **Short-term Memory** | Stores `chat_history` on client, sends it with every request |
| **Tool (Function)** | Detects keyword → calls `get_current_time()` returning real time |

## Project Structure

```
mini-chatbot/
├── backend/
│    └── server.js    ← Express backend + LLM call logic
├── frontend/
│    └── index.html   ← Chat UI
├── .env              ← API key (use .gitignore)
└── package.json
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

### 3. Run the server

```bash
node server.js
```

Open your browser at **http://localhost:3000**

## Testing Each Concept

| Message | Concept tested |
|---|---|
| "what is your name?" | Instructions / System prompt |
| "what did I just ask?" | Short-term Memory |
| "what time is it?" | Tool / Function calling |
| Chat 5–6 turns in a row | Memory accumulation |

## Configuration

```js
const MODEL = 'openrouter/free'; // I use this because it can able to auto-selects an available free model
```

## Next Steps

- [ ] Add RAG — let the chatbot read a PDF/text file and answer based on it
- [ ] Implement real function calling (model decides when to call a tool)
- [ ] Deploy to Render or Railway