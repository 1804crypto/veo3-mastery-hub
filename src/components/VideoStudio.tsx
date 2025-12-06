import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useLocation } from 'react-router-dom';
import Button from './ui/Button';
import Card from './ui/Card';
import { useToast } from '../contexts/ToastContext';
import { useDownloadVideo } from '../hooks/useVideo';

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

const VideoStudio: React.FC = () => {
    const location = useLocation();
    const initialPrompt = location.state?.prompt as string | undefined;

    // Initialize apiKey from localStorage
    const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('gemini_api_key'));
    const [prompt, setPrompt] = useState(initialPrompt || '');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
    const [isLoading, setIsLoading] = useState(false);
    const [generationStatus, setGenerationStatus] = useState(loadingMessages[0]);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    // New state for manual input
    const [manualKeyInput, setManualKeyInput] = useState('');

    const { addToast } = useToast();
    const { mutateAsync: downloadVideo } = useDownloadVideo();

    useEffect(() => {
        if (initialPrompt) {
            setPrompt(initialPrompt);
        }
    }, [initialPrompt]);

    // Handle manual key submission
    const handleSaveKey = () => {
        if (!manualKeyInput.trim()) {
            addToast("Please enter a valid API key.", "error");
            return;
        }
        localStorage.setItem('gemini_api_key', manualKeyInput.trim());
        setApiKey(manualKeyInput.trim());
        addToast("API Key saved successfully!", "success");
    };

    const handleClearKey = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey(null);
        setManualKeyInput('');
        addToast("API Key disconnected.", "success");
    };

    const handleSelectKey = async () => {
        try {
            if (window.aistudio) {
                await window.aistudio.openSelectKey();
                const hasKey = await window.aistudio.hasSelectedApiKey();
                if (hasKey) {
                    // If extension works, we might treat it as "connected" without a manual string, 
                    // but for this fix, we primarily want the manual fallback. 
                    // Let's just notify the user.
                    addToast("Extension key selected! (Note: Manual key takes precedence if set)", "success");
                }
            } else {
                addToast("AI Studio extension not found. Please enter key manually below.", "error");
            }
        } catch (e) {
            console.error("Error opening select key dialog:", e);
            addToast("Could not open API Key selection.", "error");
        }
    };

    const handleGenerate = async () => {
        if (!apiKey && (!window.aistudio)) {
            addToast("Please connect an API key first.", "error");
            return;
        }

        let textPrompt: string;
        try {
            const parsedPrompt = JSON.parse(prompt);
            textPrompt = `${parsedPrompt.Subject}, ${parsedPrompt.Action}, ${parsedPrompt.Scene}. In the style of ${parsedPrompt.Style}.`;
        } catch {
            // If it's not JSON, just use the raw text
            textPrompt = prompt;
        }

        setIsLoading(true);
        setGeneratedVideoUrl(null);
        setGenerationStatus(loadingMessages[0]);

        try {
            // Use the manual key if available, otherwise try to rely on environment (or extension logic if we impl it deeper)
            // For now, we prioritize the manual key which solves the user's issue.
            const keyToUse = apiKey || import.meta.env.VITE_GEMINI_API_KEY!;

            const ai = new GoogleGenAI({ apiKey: keyToUse });
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
                const videoBlob = await downloadVideo({ downloadLink, apiKey: keyToUse });
                const videoUrl = URL.createObjectURL(videoBlob);
                setGeneratedVideoUrl(videoUrl);
            } else {
                throw new Error('No video URI returned from the operation.');
            }
        } catch (error: unknown) {
            console.error("Video generation failed:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);

            if (errorMessage.includes('Requested entity was not found') || errorMessage.includes('API key not valid')) {
                addToast('Your API key may be invalid. Please check it.', 'error');
                // Don't force logout, just let them retry/edit
            } else {
                addToast(`Video generation failed: ${errorMessage}`, 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // If no API key is set, show the connection screen
    if (!apiKey) {
        return (
            <Card className="max-w-2xl mx-auto text-center p-8">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.542 16.314a1.697 1.697 0 01-1.834.18l-.502-.134a1.697 1.697 0 01-1.071-1.07L8 14.5l-.342.342a1.697 1.697 0 01-1.834.18l-.502-.134a1.697 1.697 0 01-1.071-1.07L4.137 13.563a1.697 1.697 0 01-.132-1.834l.342-.342A6 6 0 014 9a6 6 0 016-6 2 2 0 012 2z" />
                        </svg>
                    </div>
                    <h2 className="font-heading text-3xl text-white mb-3">Connect Your AI Studio Key</h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                        To generate unlimited videos, simply paste your Google Gemini API key below.
                        Your key is stored locally on your device.
                    </p>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                        <label className="block text-sm font-medium text-gray-300 mb-2 text-left">API Key</label>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                value={manualKeyInput}
                                onChange={(e) => setManualKeyInput(e.target.value)}
                                placeholder="AIzaSy..."
                                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button onClick={handleSaveKey}>
                                Connect
                            </Button>
                        </div>
                        <p className="mt-3 text-xs text-gray-500 text-left">
                            Don't have a key?{' '}
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
                                Get one from Google AI Studio
                            </a>
                        </p>
                    </div>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-gray-800 px-2 text-sm text-gray-500">Or use extension</span>
                        </div>
                    </div>

                    <Button onClick={handleSelectKey} variant="secondary" className="w-full">
                        Connect via AI Studio Extension
                    </Button>
                </div>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center flex flex-col items-center justify-center py-20">
                <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                    <div className="relative w-24 h-24 bg-gray-800/80 backdrop-blur rounded-full flex items-center justify-center border border-gray-700 shadow-xl">
                        <svg className="w-10 h-10 text-blue-400 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <h2 className="font-heading text-3xl text-white mb-2">Generating Your Video</h2>
                <p className="text-blue-400/80 animate-pulse text-sm font-medium tracking-wide">{generationStatus}</p>
                <div className="mt-8 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-progress"></div>
                </div>
            </div>
        );
    }

    if (generatedVideoUrl) {
        return (
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
                <div className="mb-8">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 mb-4">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Generation Successful
                    </span>
                    <h2 className="font-heading text-4xl text-white">Your Masterpiece</h2>
                </div>

                <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-gray-700 bg-black mb-8">
                    <video src={generatedVideoUrl} controls autoPlay loop className="w-full" />
                </div>

                <div className="flex justify-center gap-4">
                    <Button onClick={() => setGeneratedVideoUrl(null)} size="lg" variant="secondary" className="px-8">
                        Create Another
                    </Button>
                    <a href={generatedVideoUrl} download={`veo3_mastery_${Date.now()}.mp4`}>
                        <Button size="lg" variant="primary" className="px-8 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download Video
                        </Button>
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading text-4xl md:text-5xl text-white mb-2">Video Studio</h1>
                    <p className="text-gray-400">Create stunning AI videos with Google VEO</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-700">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-sm text-gray-300 font-medium">Connected</span>
                    <button
                        onClick={handleClearKey}
                        className="text-xs text-red-400 hover:text-red-300 ml-2 hover:underline"
                    >
                        Disconnect
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Prompt Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="h-full border-blue-500/20 shadow-blue-900/5">
                        <label className="block text-sm font-medium text-blue-300 mb-2 flex justify-between">
                            <span>Prompt Description</span>
                            <span className="text-xs text-gray-500">Be descriptive</span>
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your video in detail... (e.g., A cinematic drone shot of a futuristic city at sunset, cyberpunk style, neon lights)"
                            className="w-full h-80 p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none text-gray-200 leading-relaxed placeholder-gray-600"
                        />
                    </Card>
                </div>

                {/* Settings Section */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-heading text-white mb-4 border-b border-gray-700 pb-2">Settings</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Aspect Ratio</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setAspectRatio('16:9')}
                                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${aspectRatio === '16:9' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-gray-900/50 border-gray-700 text-gray-500 hover:bg-gray-800'}`}
                                    >
                                        <div className="w-8 h-5 border-2 border-current rounded-sm"></div>
                                        <span className="text-xs font-medium">16:9</span>
                                    </button>
                                    <button
                                        onClick={() => setAspectRatio('9:16')}
                                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${aspectRatio === '9:16' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-gray-900/50 border-gray-700 text-gray-500 hover:bg-gray-800'}`}
                                    >
                                        <div className="w-5 h-8 border-2 border-current rounded-sm"></div>
                                        <span className="text-xs font-medium">9:16</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Resolution</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setResolution('720p')}
                                        className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${resolution === '720p' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-gray-900/50 border-gray-700 text-gray-500 hover:bg-gray-800'}`}
                                    >
                                        720p HD
                                    </button>
                                    <button
                                        onClick={() => setResolution('1080p')}
                                        className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${resolution === '1080p' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-gray-900/50 border-gray-700 text-gray-500 hover:bg-gray-800'}`}
                                    >
                                        1080p FHD
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button onClick={handleGenerate} size="lg" className="w-full py-4 text-base shadow-lg shadow-blue-500/20 group">
                                    <span className="mr-2">Generate Video</span>
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </Button>
                                <p className="text-center text-xs text-gray-500 mt-3">
                                    Est. time: 30-60 seconds
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VideoStudio;