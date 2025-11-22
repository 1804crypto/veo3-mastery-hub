import { useMutation } from '@tanstack/react-query';
import { GoogleGenAI } from '@google/genai';
import { Message } from '../types';

interface AIRequest {
    userMessage: string;
    chatHistory: Message[];
}

async function getAIReply({ userMessage, chatHistory }: AIRequest): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Gracefully handle missing API key (free tier compatibility)
    if (!apiKey) {
        return "I'm an AI assistant for VEO3 prompt engineering! To enable AI responses, please configure the Gemini API key in your environment variables. In the meantime, feel free to ask the community for help - we're all here to learn together! 🎬";
    }

    const ai = new GoogleGenAI({ apiKey });

    const historyText = chatHistory
        .slice(-8) // Use last 8 messages for context
        .map(msg => `${msg.user}: ${msg.message}`)
        .join('\n');

    const prompt = `You are an expert AI video prompt engineer and a helpful assistant named AI_Assistant in the VEO3 Mastery Hub community. Keep your responses concise (2-3 sentences), friendly, and focused on helping users with VEO3, cinematic prompting, and AI video generation.

Here is the recent chat history for context:
${historyText}

Now, respond to the latest message.
You: ${userMessage}
AI_Assistant:`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error: unknown) {
        console.error("Gemini API call failed:", error);

        const errorMessage = error instanceof Error ? error.message : String(error);

        // Handle free tier quota exceeded gracefully
        if (errorMessage.includes('quota') || errorMessage.includes('429')) {
            return "I've reached my free tier limit, but I'm still here to help! Feel free to ask the community - we have many experienced VEO3 users who can assist. Check out the Learning Journey for detailed guides! 📚";
        }
        return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or ask the community for help!";
    }
}

export const useCommunityAI = () => {
    return useMutation({
        mutationFn: getAIReply,
    });
};
