
import { generatePromptFromIdea } from './src/utils/gemini';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);
console.log('VITE_GEMINI_API_KEY present:', !!process.env.VITE_GEMINI_API_KEY);
console.log('Using API Key:', !!apiKey);

async function testPromptGen() {
    if (!apiKey) {
        console.error('No API key found');
        return;
    }

    try {
        console.log('Generating prompt...');
        const result = await generatePromptFromIdea('A futuristic city with flying cars', 'Cyberpunk', '8 seconds');
        console.log('Prompt generated successfully!');
        console.log('Result length:', result.length);
        console.log('Preview:', result.substring(0, 100) + '...');
    } catch (error) {
        console.error('Error:', error);
    }
}

testPromptGen();
