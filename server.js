import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.static('public'));

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'openrouter/free';

const systemPrompt = `You are a helpful assistant named Mia.
Always reply in the same language the user writes in.
Keep answers concise.`;

function get_current_time() {
  return new Date().toLocaleTimeString('vi-VN');
}

async function callLLM(messages) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_KEY}`
    },
    body: JSON.stringify({ model: MODEL, messages })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  return data.choices[0].message.content;
}

app.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  // Tool
  const isTimeQuery = /mấy giờ|what time/i.test(message);
  if (isTimeQuery) {
    return res.json({ reply: `It's ${get_current_time()} o'clock now` });
  }

  const messages = [
    { role: 'system', content: systemPrompt },
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