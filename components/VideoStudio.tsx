import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import Button from './ui/Button';
import Card from './ui/Card';
import { useToast } from '../contexts/ToastContext';
import { useDownloadVideo } from '../src/hooks/useVideo';

// Define the AI Studio interface on Window
declare global {
    interface Window {
        aistudio: {
            hasSelectedApiKey: () => Promise<boolean>;
            openSelectKey: () => Promise<void>;
        };
    }
}

const loadingMessages = [
    "Warming up the digital cameras...",
    "Calibrating cinematic lenses...",
    "Compositing the scene...",
    "Adjusting the three-point lighting...",
    "Applying advanced color grade...",
    "Choreographing the action...",
    "Rendering final frames...",
    "Adding synchronized audio...",
];

interface VideoStudioProps {
    initialPrompt: string | null;
}

const VideoStudio: React.FC<VideoStudioProps> = ({ initialPrompt }) => {
    const [apiKeySelected, setApiKeySelected] = useState<boolean | null>(null);
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
    const [isLoading, setIsLoading] = useState(false);
    const [generationStatus, setGenerationStatus] = useState(loadingMessages[0]);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const { addToast } = useToast();
    const { mutateAsync: downloadVideo } = useDownloadVideo();

    useEffect(() => {
        const checkApiKey = async () => {
            try {
                // Use optional chaining in case aistudio is not injected yet
                if (window.aistudio) {
                    const hasKey = await window.aistudio.hasSelectedApiKey();
                    setApiKeySelected(hasKey);
                } else {
                    setApiKeySelected(false);
                }
            } catch (e) {
                console.error("Could not check for API key:", e);
                // Assume no key is available if the check fails.
                setApiKeySelected(false);
            }
        };
        checkApiKey();
    }, []);

    // ... (rest of the component)

    const handleSelectKey = async () => {
        try {
            if (window.aistudio) {
                await window.aistudio.openSelectKey();
                // Assume success and update UI immediately to avoid race condition
                setApiKeySelected(true);
                addToast("API Key selected successfully!", "success");
            } else {
                addToast("AI Studio extension not found.", "error");
            }
        } catch (e) {
            console.error("Error opening select key dialog:", e);
            addToast("Could not open API Key selection.", "error");
        }
    };

    const handleGenerate = async () => {
        let textPrompt: string;
        try {
            const parsedPrompt = JSON.parse(prompt);
            // Extract a simple text version for the VEO API
            textPrompt = `${parsedPrompt.Subject}, ${parsedPrompt.Action}, ${parsedPrompt.Scene}. In the style of ${parsedPrompt.Style}.`;
        } catch {
            addToast("The provided prompt is not valid JSON.", "error");
            return;
        }

        setIsLoading(true);
        setGeneratedVideoUrl(null);
        setGenerationStatus(loadingMessages[0]);

        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY! });
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: textPrompt,
                config: {
                    numberOfVideos: 1,
                    resolution,
                    aspectRatio,
                }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            if (operation.error) {
                throw new Error((operation.error.message as string) || 'Video generation failed.');
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                const videoBlob = await downloadVideo({ downloadLink, apiKey: import.meta.env.VITE_GEMINI_API_KEY! });
                const videoUrl = URL.createObjectURL(videoBlob);
                setGeneratedVideoUrl(videoUrl);
            } else {
                throw new Error('No video URI returned from the operation.');
            }
        } catch (error: unknown) {
            console.error("Video generation failed:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);

            if (errorMessage.includes('Requested entity was not found.')) {
                addToast('Your API key is invalid. Please select a valid key.', 'error');
                setApiKeySelected(false); // Force re-selection
            } else {
                addToast(`Video generation failed: ${errorMessage}`, 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (apiKeySelected === null) {
        return (
            <div className="text-center">
                <h2 className="font-heading text-4xl text-white">Initializing Studio...</h2>
                <p className="text-gray-400 mt-2">Checking for API key...</p>
            </div>
        );
    }

    if (!apiKeySelected) {
        return (
            <Card className="max-w-2xl mx-auto text-center">
                <h2 className="font-heading text-4xl text-blue-400">Connect Your Account</h2>
                <p className="mt-4 text-gray-300">
                    To generate videos, please connect your Google AI Studio account. This allows the VEO3 Mastery Hub to generate videos using your own API key.
                </p>
                <p className="mt-4 text-sm text-gray-400">
                    Charges for video generation are billed to your selected Google Cloud project. For details, see the{' '}
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        Gemini API billing documentation
                    </a>.
                </p>
                <Button onClick={handleSelectKey} size="lg" className="mt-6">
                    Select API Key
                </Button>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-50"></div>
                    <div className="relative w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 00-5.84-2.56v4.82m0 0a6 6 0 01-7.38-5.84h4.82m2.56 0a14.98 14.98 0 012.56-5.84v4.82m-4.82 0h-4.82a6 6 0 015.84-7.38v4.82m-2.56 0a14.98 14.98 0 00-2.56-5.84v4.82m7.38 5.84a6 6 0 01-7.38 5.84h4.82m-2.56 0a14.98 14.98 0 01-2.56 5.84v-4.82" />
                        </svg>
                    </div>
                </div>
                <h2 className="font-heading text-4xl text-white">Generating Your Masterpiece...</h2>
                <p className="mt-2 text-gray-400 transition-opacity duration-500">{generationStatus}</p>
            </div>
        );
    }

    if (generatedVideoUrl) {
        return (
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-heading text-4xl text-white mb-6">Generation Complete!</h2>
                <video src={generatedVideoUrl} controls autoPlay loop className="w-full rounded-lg shadow-lg mb-6" />
                <div className="flex justify-center gap-4">
                    <Button onClick={() => setGeneratedVideoUrl(null)} size="lg" variant="secondary">
                        Generate Another
                    </Button>
                    <a href={generatedVideoUrl} download={`veo3_mastery_${Date.now()}.mp4`}>
                        <Button size="lg" variant="primary">Download Video</Button>
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl text-center mb-8 text-white">Video Studio</h1>
            <Card>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-2">VEO3 Prompt (JSON)</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Paste your generated JSON prompt here..."
                            className="w-full h-64 p-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-y font-mono text-xs"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-blue-300 mb-2">Aspect Ratio</label>
                            <div className="flex gap-2">
                                <Button onClick={() => setAspectRatio('16:9')} variant={aspectRatio === '16:9' ? 'primary' : 'secondary'} className="flex-1">16:9 Landscape</Button>
                                <Button onClick={() => setAspectRatio('9:16')} variant={aspectRatio === '9:16' ? 'primary' : 'secondary'} className="flex-1">9:16 Portrait</Button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-300 mb-2">Resolution</label>
                            <div className="flex gap-2">
                                <Button onClick={() => setResolution('720p')} variant={resolution === '720p' ? 'primary' : 'secondary'} className="flex-1">720p</Button>
                                <Button onClick={() => setResolution('1080p')} variant={resolution === '1080p' ? 'primary' : 'secondary'} className="flex-1">1080p</Button>
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleGenerate} size="lg" className="w-full">
                        Generate Video
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default VideoStudio;