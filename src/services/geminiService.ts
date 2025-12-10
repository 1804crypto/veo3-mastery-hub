import { VEO3Prompt } from "../types";

export async function generateVEO3Prompt(idea: string): Promise<VEO3Prompt> {
  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/generate-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 'credentials: include' is crucial for sending the httpOnly token cookie
      credentials: 'include',
      body: JSON.stringify({ idea }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Find a way to trigger login modal globally, for now, alert is a placeholder
        alert('Authentication failed. Please log in again.');
        throw new Error('Authentication failed. Please log in.');
      }
      if (response.status === 429) {
        throw new Error('You have exceeded the request limit. Please try again later.');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred on the server.');
    }

    const data = await response.json();

    // The backend returns { ok: true, prompt: "stringified VEO3Prompt object" }
    // The mocked response from the backend is also a stringified VEO3Prompt object.
    const parsedPrompt = JSON.parse(data.prompt);

    return parsedPrompt as VEO3Prompt;

  } catch (error) {
    console.error("Error calling backend API:", error);
    // Re-throw to be caught by the calling component
    throw error;
  }
}