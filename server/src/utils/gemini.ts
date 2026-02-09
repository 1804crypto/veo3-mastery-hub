import { VEO3Prompt } from '../types/shared';
import { getCachedResponse, setCachedResponse } from './cache';
import { CINEMATIC_MASTER_GUIDE } from './cinematicGuide';

const ZAI_API_KEY = process.env.ZAI_API_KEY;
// Using GLM-4-Flash which is often the most reliable/fast model tier available on the generic endpoint.
// If this fails, the robust fallback system will kick in.
const ZAI_MODEL = 'glm-4-flash';
const ZAI_ENDPOINT = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

const META_PROMPT = `
You are "Cine-Maestro," an expert Hollywood film director and VEO3 prompt engineer. Your goal is to transform a user's raw video idea into a hyper-detailed, professional, 7-component JSON prompt for the VEO3 model.

You MUST use the "Cinematic Master Guide" below to ground your decisions. Focus on Neuro-Aesthetics, Physics-based prompting, and Experimental camera moves to create a "Signature Shot."

### CINEMATIC MASTER GUIDE:
${CINEMATIC_MASTER_GUIDE}

### PROMPT STRUCTURE (7 COMPONENTS):
1.  **Subject:** Minimum 15+ attributes (age, clothing, skin texture, lighting interaction).
2.  **Action:** Use physics-based verbs (momentum, weight shift) and timing. Apply "Cloth Simulation" or "Fluid Dynamics" keywords from the guide.
3.  **Scene:** Define 3 layers (Foreground, Mid, Background). Use "Chiaroscuro" or "Rembrandt" lighting setups.
4.  **Style:** Specify Camera Shot, Angle, Movement (using '(that's where the camera is)' syntax), Lens (use Lens Lexicon), and Color Grade.
5.  **Dialogue:** Format as (Instruction/Tone) (Character Name): "Dialogue here".
6.  **Sounds:** Separate Ambience, SFX, and Score.
7.  **Technical:** Include the strict "Guardrails" and "Physics Modifiers" for consistency.

The final output MUST be a single JSON object with the following keys: "veo3_prompt", "style_references", "technical_specifications", "production_parameters", "narrative_summary". Do not add any explanation, markdown formatting, or code fences like \`\`\`json around the JSON. It must be a raw JSON object string.

User's Idea:
`;

async function callZAI(systemPrompt: string, userPrompt: string, useJson = true): Promise<string> {
  if (!ZAI_API_KEY) throw new Error('ZAI_API_KEY not found');

  const payload = {
    model: ZAI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    // Z.ai often prefers explicit instructions for JSON rather than a 'response_format' field on some models,
    // but we can try response_format if supported, or rely on the system prompt.
    // For safety, we rely heavily on the system prompt instruction.
  };

  const response = await fetch(ZAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ZAI_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Z.ai API Error: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`Z.ai API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Z.ai returned no content');
  }

  return content;
}

export async function generatePromptFromIdea(
  idea: string,
  style?: string, // style and length are kept for potential future use
  length?: string
): Promise<string> {
  // If no API key is present, return a mocked response for development/testing
  if (!ZAI_API_KEY) {
    console.warn('ZAI_API_KEY not found. Returning a fallback prompt.');
    return getMockPrompt(idea, style, length);
  }

  // Check cache first
  const cached = getCachedResponse<string>('prompt', idea);
  if (cached) {
    console.log('[Z.ai] Returning cached prompt for idea');
    return cached;
  }

  try {
    const result = await callZAI(META_PROMPT, `"${idea}"`, true);

    // Cache the successful response
    if (result) {
      setCachedResponse('prompt', idea, result);
    }

    return result;
  } catch (error: unknown) {
    console.error('Error calling Z.ai API, falling back to offline mode:', error);
    // Return robust offline prompt if API failure to avoid crashing the user experience
    return getMockPrompt(idea, style, length);
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
  if (!ZAI_API_KEY) return `(Enhanced) ${text}`;

  try {
    const userPrompt = `Context of full prompt: ${context}\n\nComponent to enhance: ${type}\nOriginal text: "${text}"\n\nRewrite this ${type} to be cinematic and detailed:`;
    const result = await callZAI(ENHANCE_PROMPT, userPrompt, false);
    return result.trim() || text;
  } catch (error) {
    console.error('Z.ai enhance error:', error);
    return text; // Fallback to original
  }
}

// Helper Arrays for Offline/Fallback Mode
const SAMPLE_LIGHTING = ['Chiaroscuro (16:1 contrast)', 'Rembrandt Lighting (45° key)', 'Butterfly Lighting', 'Edge/Rim Lighting', 'Uncorrected Mixed Lighting (Daylight/Tungsten)'];
const SAMPLE_LENSES = ['14mm Ultra-Wide', '35mm Anamorphic (oval bokeh)', '85mm Portrait (f/1.8)', '200mm Telephoto (compression)', 'Tilt-Shift'];
const SAMPLE_MOVES = ['Parallax Echo Dolly', 'Quantum Orbit', 'Breath Sync Zoom', 'Reverse Gravity Drop', 'Impossible Mirror Shot', 'Handheld (mirror neuron trigger)'];
const SAMPLE_PHYSICS = ['Complex multi-layer cloth simulation', 'Non-Newtonian fluid dynamics', 'Subsurface scattering on skin', 'Rigid body dynamics 9.8m/s²'];
const SAMPLE_NEGATIVES = "mangled hands, blurry, watermark, bad composition, ugly, distorted faces, extra limbs, jello effect, sliding feet, texture smearing";

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getMockPrompt(idea: string, style?: string, length?: string): string {
  const lighting = getRandom(SAMPLE_LIGHTING);
  const lens = getRandom(SAMPLE_LENSES);
  const move = getRandom(SAMPLE_MOVES);
  const physics = getRandom(SAMPLE_PHYSICS);

  const mockInnerPrompt = {
    Subject: `Detailed subject for idea: '${idea}'. Characteristics: mid-30s, weathered skin texture (subsurface scattering), realistic clothing (velvet/leather/denim) reacting to environment. build: athletic.`,
    Action: `The subject's movement is characterized by ${move}. Physics simulation applied: ${physics}. Weight distribution is clear in every step.`,
    Scene: `Cinematic environment based on: '${idea}'. Foreground elements (debris/mist) for depth, Mid-ground subject interaction, Background atmospheric haze and volumetric lighting.`,
    Style: `Shot Configuration: ${move}. Lens: ${lens}. Lighting Setup: ${lighting}. Color Grade: Teal & Orange / High Contrast.`,
    Dialogue: "(Whispering) (Character): \"We are strictly adhering to the offline protocols now.\"",
    Sounds: "Ambient wind, distant urban hum OR nature sounds, specific SFX (crunching footsteps, rustling fabric), Hans Zimmer-style score for tension.",
    Technical: `Negative prompt: ${SAMPLE_NEGATIVES}. Maintain physiological integrity.`
  };

  const mockPrompt: VEO3Prompt = {
    veo3_prompt: JSON.stringify(mockInnerPrompt, null, 2),
    style_references: [`Master Guide Style (${lighting})`, `Director Choice (${lens})`],
    technical_specifications: `4K, 24fps, 2.39:1 Anamorphic, ${length || '8 seconds'}`,
    production_parameters: "Render with VEO3 Physics Engine v2.0 (Offline Fallback).",
    narrative_summary: `[OFFLINE MODE] This signature shot combines ${lighting} with a ${lens} to create a deep emotional impact based on: '${idea}'. Grounded in Neuro-Aesthetic principles.`
  };
  return JSON.stringify(mockPrompt);
}
