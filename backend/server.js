import 'dotenv/config';
import express from 'express';
import { loadAndChunk, findRelevantChunks } from './rag.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.static('../frontend'));

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'openai/gpt-oss-20b:free';

//1 time load after the sever is started
const chunks = loadAndChunk(join(__dirname, '../data/knowledge.txt'));

const systemPrompt = `You are a helpful assistant named Mia.
Always reply in the same language the user writes in.
Keep answers concise.`;

function get_current_time() {
  return new Date().toLocaleTimeString('vi-VN');
}

async function callLLM(messages, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_KEY}`
      },
      body: JSON.stringify({ model: MODEL, messages })
    });
    const data = await res.json();

    if (data.error?.code === 429) {
      const wait = (data.error.metadata?.retry_after_seconds || 8) * 1000;
      console.log(`Rate limited, thử lại sau ${wait/1000}s...`);
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    //check errors
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  }
  throw new Error('Exceeded the number of retry attempts.');
}

app.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  // Tool
  const isTimeQuery = /mấy giờ|what time/i.test(message);
  if (isTimeQuery) {
    return res.json({ reply: `It's ${get_current_time()} o'clock now` });
  }

  //RAG: find relavant chunks
  const relevantChunks = findRelevantChunks(message, chunks);
  console.log(`Relevant chunks:`, relevantChunks);

  //Merge context into system prompt
  const contextStr = relevantChunks.length > 0
    ? `\n\nContext (Use this information to answer if relevant):\n${relevantChunks.join('\n\n')}`
    : '';

  const messages = [
    { role: 'system', content: systemPrompt + contextStr},
    ...history,
    { role: 'user', content: message }
  ];

  try {
    const reply = await callLLM(messages);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Server Error: ' + err.message });
  }
});

app.listen(3000, () => console.log('http://localhost:3000'));