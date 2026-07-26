import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, systemInstruction, agentName } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

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

        let sysPrompt = systemInstruction || 'You are Camry OS, an intelligent local AI assistant.';
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
        return res.status(200).json({
          text,
          model: 'gemini-3.6-flash',
          provider: 'Google Gemini',
        });
      } catch (geminiError: any) {
        console.error('Gemini API Error:', geminiError?.message || geminiError);
        return res.status(500).json({
          error: `Gemini API error: ${geminiError?.message || 'Failed to call Gemini API'}. Make sure your GEMINI_API_KEY is valid on Vercel environment variables.`,
          isConfigError: true
        });
      }
    }

    // Fallback if GEMINI_API_KEY is not set on Vercel
    const agentContext = agentName ? `[${agentName}] ` : '';
    const fallbackResponse = `${agentContext}Processed on Camry Engine.
    
Regarding "${prompt.slice(0, 60)}${prompt.length > 60 ? '...' : ''}":

💡 **Note for Vercel Deployment**: To enable live responses from Google Gemini on Vercel, please set the \`GEMINI_API_KEY\` environment variable in your Vercel Dashboard:
1. Go to your Vercel Project Settings -> Environment Variables.
2. Add key \`GEMINI_API_KEY\` with your Google AI Studio API key value.
3. Redeploy your project on Vercel.`;

    return res.status(200).json({
      text: fallbackResponse,
      model: 'gpt-oss-120b (Local)',
      provider: 'Camry Engine',
      isLocalFallback: true,
    });

  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ error: 'Failed to process chat request' });
  }
}
