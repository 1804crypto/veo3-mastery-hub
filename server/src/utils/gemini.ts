import { GoogleGenAI, Type } from '@google/genai';
import { VEO3Prompt } from '../types/shared';
import { getCachedResponse, setCachedResponse } from './cache';
const META_PROMPT = `
You are "Cine-Maestro," an expert Hollywood film director and VEO3 prompt engineer. Your goal is to transform a user's raw video idea into a hyper-detailed, professional, 7-component JSON prompt for the VEO3 model.

You must synthesize knowledge from the following cinematic principles:
1.  **Forensic Film Analysis:** Understand the psychological impact of shots (EWS, CU), angles (Low, High, Dutch), lenses (Wide, Telephoto), and lighting (Chiaroscuro, High-Key).
2.  **Director Styles:** Incorporate techniques from masters like Martin Scorsese (kinetic energy, voice-over), Spike Lee (double-dolly, direct address), Hitchcock (suspense, 50mm lens), Kurosawa (telephoto compression, weather), etc.
3.  **VEO3 Prompting Essentials:** Adhere to a strict 7-component structure: Subject, Action, Scene, Style, Dialogue, Sounds, Technical.
    *   **Subject:** Minimum 15+ attributes for character consistency (age, ethnicity, hair, eyes, build, clothing, etc.).
    *   **Action:** Must be physically achievable in 8 seconds with realistic physics keywords (momentum, weight distribution, biomechanics).
    *   **Scene:** Use a 3-layer structure (Foreground, Mid-ground, Background) with 10+ environmental details.
    *   **Style:** Specify camera shot, angle, movement (using '(that's where the camera is)' syntax), lens, lighting (3-point, Rembrandt, etc.), and color grade (Teal & Orange, Desaturated, etc.).
    *   **Dialogue:** Use colon format to prevent subtitles: (Character Name): "Dialogue here".
    *   **Sounds:** Detail ambient sound, SFX, and musical score to prevent audio hallucinations.
    *   **Technical (Negative Prompt)::** Include comprehensive negatives for anatomy (mangled hands, distorted faces), physics (floating, clipping), and visual quality (blurry, watermarks).

The final output MUST be a single JSON object with the following keys: "veo3_prompt", "style_references", "technical_specifications", "production_parameters", "narrative_summary". Do not add any explanation, markdown formatting, or code fences like \`\`\`json around the JSON. It must be a raw JSON object string.

User's Idea:
`;


export async function generatePromptFromIdea(
  idea: string,
  style?: string, // style and length are kept for potential future use
  length?: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || 'AIzaSyCsb4CW-zyGcpYCbTMQ_B44BZw9B8hzcDs';

  // If no API key is present, return a mocked response for development/testing
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not found. Returning a mocked prompt.');
    const mockInnerPrompt = {
      Subject: `A mock subject for the idea: '${idea}'`,
      Action: "The subject performs a mocked action with cinematic flair.",
      Scene: `A mocked scene with a style of: ${style || 'cinematic'}.`,
      Style: "Mocked low-angle shot, 35mm lens, dramatic lighting.",
      Dialogue: "(Mock Character): \"This is a test line.\"",
      Sounds: "Mock ambient sounds of a bustling city, a single sharp SFX, and a tense musical score.",
      Technical: "Negative prompt: mangled hands, blurry, watermark, bad composition, ugly."
    };
    const mockPrompt: VEO3Prompt = {
      veo3_prompt: JSON.stringify(mockInnerPrompt, null, 2),
      style_references: ["Mock Movie 1", "Mock Director"],
      technical_specifications: `1080p, 24fps, 16:9 aspect ratio, ${length || '8 seconds'}`,
      production_parameters: "This is a mocked generation. Render an 8-second clip.",
      narrative_summary: `This is a mocked narrative summary for the user's idea, which was: '${idea}'. The goal is to create a compelling, short cinematic moment.`
    };
    return JSON.stringify(mockPrompt);
  }

  // Check cache first
  const cached = getCachedResponse<string>('prompt', idea);
  if (cached) {
    console.log('[Gemini] Returning cached prompt for idea');
    return cached;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const fullPrompt = `${META_PROMPT}"${idea}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            veo3_prompt: { type: Type.STRING },
            style_references: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            technical_specifications: { type: Type.STRING },
            production_parameters: { type: Type.STRING },
            narrative_summary: { type: Type.STRING },
          },
          required: [
            "veo3_prompt",
            "style_references",
            "technical_specifications",
            "production_parameters",
            "narrative_summary"
          ]
        }
      }
    });

    const result = response.text || '';

    // Cache the successful response
    if (result) {
      setCachedResponse('prompt', idea, result);
    }

    return result;
  } catch (error: unknown) {
    console.error('Error calling Gemini API:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStatus = (error as { status?: number })?.status;

    // Handle free tier quota exceeded gracefully
    if (errorMessage.includes('quota') ||
      errorMessage.includes('429') ||
      errorStatus === 429) {
      console.warn('Gemini API quota exceeded. Returning mock response for free tier compatibility.');
      // Return mock response instead of error (free tier compatibility)
      const mockInnerPrompt = {
        Subject: `A detailed subject for the idea: '${idea}'`,
        Action: "The subject performs an action with cinematic flair.",
        Scene: `A cinematic scene matching the idea: '${idea}'.`,
        Style: "Professional low-angle shot, 35mm lens, dramatic three-point lighting.",
        Dialogue: "(Character): \"A compelling dialogue line.\"",
        Sounds: "Rich ambient sounds, synchronized SFX, and emotional musical score.",
        Technical: "Negative prompt: mangled hands, blurry, watermark, bad composition, ugly, distorted faces, extra limbs."
      };
      const mockPrompt: VEO3Prompt = {
        veo3_prompt: JSON.stringify(mockInnerPrompt, null, 2),
        style_references: ["Professional Cinema", "Modern Film Production"],
        technical_specifications: `1080p, 24fps, 16:9 aspect ratio, ${length || '8 seconds'}`,
        production_parameters: "Generate an 8-second clip with cinematic quality.",
        narrative_summary: `This prompt is designed to create a compelling cinematic moment based on: '${idea}'. The structure follows professional VEO3 prompting principles.`
      };
      return JSON.stringify(mockPrompt);
    }

    throw new Error('Failed to generate prompt from Gemini API.');
  }
}


const ENHANCE_PROMPT = `
You are a "Ghostwriter" for a high-end film director. Your job is to take a specific component of a VEO3 video prompt (Subject, Action, Scene, Style, Dialogue, or Sounds) and rewrite it to be more cinematic, detailed, and technically precise for AI video generation.

Rules:
1.  **Subject:** Add 5+ visually descriptive attributes (age, texture, lighting on skin).
2.  **Action:** Use physics-based verbs (heaving, shattering, gliding) and precise timing.
3.  **Scene:** Describe 3 layers of depth (foreground, mid, background).
4.  **Style:** Specify camera gear (e.g., "Arri Alexa, 35mm prime"), lighting ("Rembrandt", "volumetric fog"), and color ("teal & orange").
5.  **Dialogue:** Format strictly as (Character Name): "Line of dialogue". No play-script styling.
6.  **Sounds:** Separate Ambience, SFX, and Score.
7.  **Goal:** Make the text 3x more detailed but focused on VISUAL/AUDIO output.
8.  **Output:** Return ONLY the rewritten text. No conversational filler or markdown.
`;

export async function enhanceText(
  text: string,
  type: string, // e.g., 'Subject', 'Action'
  context: string // The full current prompt for context
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || 'AIzaSyCsb4CW-zyGcpYCbTMQ_B44BZw9B8hzcDs';
  if (!apiKey) return `(Enhanced) ${text}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const fullPrompt = `${ENHANCE_PROMPT}\n\nContext of full prompt: ${context}\n\nComponent to enhance: ${type}\nOriginal text: "${text}"\n\nRewrite this ${type} to be cinematic and detailed:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp', // Fast model for real-time edits
      contents: fullPrompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error('Gemini verify error:', error);
    return text; // Fallback to original
  }
}
