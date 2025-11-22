# Plan: Move Gemini API Call to Backend

This document outlines the necessary changes to move the client-side Gemini API call to our secure, rate-limited backend endpoint (`/api/generate-prompt`). This refactoring improves security, centralizes logic, and abstracts complexity from the frontend.

## 1. Update Frontend Service (`services/geminiService.ts`)

The `generateVEO3Prompt` function will be updated to call our backend instead of Google's API directly. This simplifies the frontend logic and keeps API keys off the client.

### Before

```typescript
import { GoogleGenAI, Type } from "@google/genai";
import { VEO3Prompt } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const META_PROMPT = `
You are "Cine-Maestro," an expert Hollywood film director and VEO3 prompt engineer...
...
User's Idea:
`;

export async function generateVEO3Prompt(idea: string): Promise<VEO3Prompt> {
  const fullPrompt = `${META_PROMPT}"${idea}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: { /* ... schema definition ... */ }
      }
    });

    const text = response.text;
    const parsedJson = JSON.parse(text);
    return parsedJson as VEO3Prompt;
  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    throw new Error("Failed to generate prompt from Gemini API.");
  }
}
```

### After

```typescript
import { VEO3Prompt } from "../types";

export async function generateVEO3Prompt(idea: string): Promise<VEO3Prompt> {
  try {
    const response = await fetch('/api/generate-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 'credentials: include' is crucial for sending the httpOnly token cookie
      credentials: 'include', 
      body: JSON.stringify({ idea }),
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('Authentication failed. Please log in.');
      if (response.status === 429) throw new Error('Request limit reached. Please try again later.');
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred on the server.');
    }

    const data = await response.json();
    
    // The backend returns { ok: true, prompt: "stringified VEO3Prompt object" }
    const parsedPrompt = JSON.parse(data.prompt);
    
    return parsedPrompt as VEO3Prompt;

  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error; // Re-throw to be caught by the UI component
  }
}
```

## 2. API Call Examples

### Using `fetch` with Cookies (Recommended)

This is the standard method for the frontend application. The `credentials: 'include'` option automatically sends the `httpOnly` cookie that was set during login.

```javascript
fetch('/api/generate-prompt',{ 
  method:'POST', 
  credentials:'include', 
  headers:{ 'Content-Type':'application/json' }, 
  body: JSON.stringify({idea: "your amazing video idea"}) 
})
.then(res => res.json())
.then(console.log);
```

### Using `fetch` with Authorization Header

If the JWT is stored manually (e.g., in `localStorage`), it can be sent as a bearer token.

```javascript
const token = localStorage.getItem('jwt_token');

fetch('/api/generate-prompt', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ idea: "your amazing video idea" })
})
.then(res => res.json())
.then(console.log);
```

## 3. Handling Mocked Response

The backend is configured to return a mocked response if the `GEMINI_API_KEY` is not set. This mock response is a stringified JSON object that matches the `VEO3Prompt` structure.

The updated frontend code handles this seamlessly. The line `const parsedPrompt = JSON.parse(data.prompt);` will work for both the real Gemini response and the mocked response from our server, as both are valid JSON strings in the expected format. No special handling is needed on the frontend.