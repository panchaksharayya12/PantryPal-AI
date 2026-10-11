import { Router, Request, Response } from 'express';
import { aiService } from '../services/aiService';

const router = Router();

// GET /api/ai/status - check if OpenAI is configured
router.get('/status', (req: Request, res: Response): void => {
  res.json({
    hasAiKey: aiService.hasAiKey(),
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
  });
});

// POST /api/ai/chat - conversational cooking questions
router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, context = {} } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const reply = await aiService.chat(message.trim(), context);
    res.json(reply);
  } catch (error: any) {
    console.error('AI chat endpoint error:', error);
    res.status(500).json({ error: 'Failed to process AI chat request' });
  }
});

export default router;

