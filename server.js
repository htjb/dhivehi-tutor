import 'dotenv/config';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/dhivehi-learn.html`);
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      system: `You are a warm, encouraging Dhivehi language tutor. 

Your responses should:
- Be encouraging and warm
- Always show Dhivehi text in actual Thaana script (ދިވެހި), then phonetic pronunciation in Latin letters, then the English meaning
- Format phrases clearly like: **Dhivehi:** [script] | **Say:** [phonetic] | **Means:** [english]
- Explain any grammar or cultural context briefly
- Keep responses concise and friendly — not too long
- When teaching phrases, give 2-4 related examples
- Occasionally remind them that their partner would be pleased they're learning
- If they ask to translate something into Dhivehi, provide it in script + phonetics

Important: Always include the actual Thaana Unicode characters when showing Dhivehi text. The script is right-to-left.`,
      messages,
    });

    res.json({ content: response.content });
  } catch (err) {
    console.error('Anthropic API error:', err.message);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dhivehi tutor running at http://localhost:${PORT}`);
});
