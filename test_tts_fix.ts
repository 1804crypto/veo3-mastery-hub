
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// Use the key we found in .env
const apiKey = "AIzaSyCsb4CW-zyGcpYCbTMQ_B44BZw9B8hzcDs"; // Key from .env

async function testTTS() {
    console.log("Testing TTS with model: gemini-2.0-flash-exp");
    try {
        const ai = new GoogleGenAI({ apiKey });
        // Try the experimental model which supports audio generation
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: [{ parts: [{ text: "Hello, this is a test." }] }],
            config: {
                responseModalities: ["AUDIO"], // Audio modality
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: "Puck" },
                    },
                },
            },
        });

        console.log("Response received.");
        const audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (audio) {
            console.log("Audio generated successfully! Length:", audio.length);
        } else {
            console.log("No audio data found.");
            console.log(JSON.stringify(response, null, 2));
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

testTTS();
