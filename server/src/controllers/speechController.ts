import { Request, Response } from 'express';
import { GoogleGenAI, Modality } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const FEMALE_VOICE_NAME = 'Kore'; // Available voices: Zephyr, Puck, Charon, Kore, Fenrir

export const generateSpeech = async (req: Request, res: Response) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ ok: false, message: 'Text is required.' });
    }

    if (!GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not configured.');
        return res.status(500).json({ ok: false, message: 'Server is not configured for text-to-speech.' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: FEMALE_VOICE_NAME },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (base64Audio) {
            res.status(200).json({ ok: true, audioContent: base64Audio });
        } else {
            throw new Error("No audio data was returned from the API.");
        }
    } catch (error) {
        console.error('Text-to-speech generation failed:', error);
        res.status(500).json({ ok: false, message: 'Failed to generate audio.' });
    }
};
