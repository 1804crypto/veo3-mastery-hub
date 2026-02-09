import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useVoiceOperator - Heather Persona
 * Heather is a cinematographer in her late 20s. 
 * Her voice is upbeat, professional, and warm.
 */
export const useVoiceOperator = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Initialize AudioContext (kept for potential future audio routing/effects)
    const initAudio = useCallback(async () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }
    }, []);

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    }, []);

    const vocalize = useCallback(async (text: string) => {
        // Ensure AudioContext is ready (satisfies browser security for future nodes)
        await initAudio();

        // Stop any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // Voice Mapping - Prioritizing high-quality, natural female voices
        const voices = window.speechSynthesis.getVoices();

        // Priority list for Heather's persona
        const preferredVoice = voices.find(v => v.name === 'Google US English') ||
            voices.find(v => v.name === 'Samantha') ||
            voices.find(v => v.name === 'Ava') ||
            voices.find(v => v.name.includes('Female')) ||
            voices.find(v => v.lang.startsWith('en-US')) ||
            voices[0];

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        /**
         * Heather's "SM7B" Tone Settings:
         * Rate: 1.05 - Slightly fast to sound upbeat and energetic.
         * Pitch: 1.0 - Balanced and human-like.
         */
        utterance.pitch = 1.05;
        utterance.rate = 1.0;

        utterance.onstart = () => {
            setIsPlaying(true);
        };

        utterance.onend = () => {
            setIsPlaying(false);
        };

        utterance.onerror = (event) => {
            console.error('Speech Synthesis Error:', event);
            setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [initAudio]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    return { vocalize, stop, isPlaying, isLoading: false };
};
