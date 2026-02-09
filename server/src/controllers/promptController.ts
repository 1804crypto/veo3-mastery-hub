import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generatePromptFromIdea, enhanceText } from '../utils/gemini';

const prisma = new PrismaClient();

export const generatePrompt = async (req: Request, res: Response) => {
  const { idea, style, length } = req.body;
  const userId = req.user?.id;

  if (!idea || typeof idea !== 'string' || !idea.trim()) {
    return res.status(400).json({ ok: false, message: 'Please provide a valid video idea (3-1000 characters).' });
  }

  const trimmedIdea = idea.trim();
  if (trimmedIdea.length < 3) {
    return res.status(400).json({ ok: false, message: 'Video idea must be at least 3 characters long.' });
  }
  if (trimmedIdea.length > 1000) {
    return res.status(400).json({ ok: false, message: 'Video idea must be less than 1000 characters.' });
  }

  if (!userId) {
    console.log(`[${new Date().toISOString()}] Prompt generation request for guest user`);
  }

  // Log request metadata, avoiding logging PII (the full idea text)
  console.log(`[${new Date().toISOString()}] Prompt generation request for user: ${userId}, idea length: ${trimmedIdea.length}`);

  try {
    const prompt = await generatePromptFromIdea(trimmedIdea, style, length);
    res.status(200).json({ ok: true, prompt });
  } catch (error: unknown) {
    console.error('Error in prompt generation controller:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    res.status(500).json({
      ok: false,
      message: errorMessage || 'Failed to generate prompt. Please try again.'
    });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ ok: false, message: 'Unauthorized' });

  try {
    const history = await prisma.prompt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Failed to fetch history' });
  }
};

export const addHistoryItem = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ ok: false, message: 'Unauthorized' });

  const { prompt, type, style, aspectRatio } = req.body;

  try {
    const newItem = await prisma.prompt.create({
      data: {
        userId,
        prompt,
        type: type || 'image',
        style,
        aspectRatio
      }
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Failed to save prompt' });
  }
};

export const deleteHistoryItem = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ ok: false, message: 'Unauthorized' });

  try {
    // Verify ownership
    const item = await prisma.prompt.findUnique({ where: { id } });
    if (!item || item.userId !== userId) {
      return res.status(404).json({ ok: false, message: 'Item not found' });
    }

    await prisma.prompt.delete({ where: { id } });
    res.status(200).json({ ok: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Failed to delete item' });
  }
};

export const clearHistory = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ ok: false, message: 'Unauthorized' });

  try {
    await prisma.prompt.deleteMany({ where: { userId } });
    res.status(200).json({ ok: true, message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Failed to clear history' });
  }
};
export const enhancePromptComponent = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ ok: false, message: 'Unauthorized' });

  const { text, type, context } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ ok: false, message: 'Text is required' });
  }

  try {
    const enhancedText = await enhanceText(text, type, context);
    res.status(200).json({ ok: true, enhancedText });
  } catch (error) {
    console.error('Error enhancing prompt component:', error);
    res.status(500).json({ ok: false, message: 'Failed to enhance text' });
  }
};
