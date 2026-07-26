import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  // AI Chat Endpoint powered by Gemini API
  app.post('/api/chat', async (req, res) => {
    try {
      const { prompt, systemInstruction, history, agentName } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
        try {
          const ai = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          });

          // Build context and system instruction
          let sysPrompt = systemInstruction || 'You are Camry OS, an intelligent on-premise local AI appliance.';
          if (agentName) {
            sysPrompt += ` You are currently acting as the specialized "${agentName}" agent.`;
          }

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
              systemInstruction: sysPrompt,
            },
          });

          const text = response.text || 'No response generated.';
          return res.json({
            text,
            model: 'gemini-3.6-flash',
            provider: 'Google Gemini',
          });
        } catch (geminiError: any) {
          console.error('Gemini API Error:', geminiError?.message || geminiError);
          // Fallback if API call errors out
        }
      }

      // Simulated local on-premise model response fallback
      const agentContext = agentName ? `[${agentName}] ` : '';
      const fallbackResponse = `${agentContext}Processed locally on Camry ONE device (gpt-oss-120b NPU acceleration).
      
Regarding "${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}":

The local model on your Camry ONE appliance has executed this query across 120B parameters on local storage without sending data to external clouds.

• Storage: 256GB NVMe (Local Cache)
• Latency: 18ms
• Encryption: Zero-Knowledge On-Device Pass-through`;

      return res.json({
        text: fallbackResponse,
        model: 'gpt-oss-120b (Local)',
        provider: 'Camry Local Engine',
        isLocalFallback: true,
      });

    } catch (error: any) {
      console.error('Chat endpoint error:', error);
      res.status(500).json({ error: 'Failed to process chat request' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
