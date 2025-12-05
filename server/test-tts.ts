
import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const modelName = 'gemini-2.5-flash-preview-tts';

console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);
console.log('VITE_GEMINI_API_KEY present:', !!process.env.VITE_GEMINI_API_KEY);
console.log('Using API Key:', !!apiKey);
console.log('Model:', modelName);

async function testTTS() {
    if (!apiKey) {
        console.error('No API key found');
        return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        console.log('Generating speech...');
        const response = await ai.models.generateContent({
            model: modelName,
            contents: [{ parts: [{ text: 'Hello world' }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        console.log('Response received');
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        console.log('Audio data length:', base64Audio ? base64Audio.length : 0);

    } catch (error) {
        console.error('Error:', error);
    }
}

testTTS();
