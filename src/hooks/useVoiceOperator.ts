import { useState, useRef, useCallback, useEffect } from 'react';

export const useVoiceOperator = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const hissSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const hissBufferRef = useRef<AudioBuffer | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Initialize AudioContext and Hiss Buffer
    const initAudio = useCallback(async () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        if (!hissBufferRef.current) {
            const sampleRate = audioContextRef.current.sampleRate;
            const bufferSize = sampleRate * 2; // 2 seconds of noise
            const buffer = audioContextRef.current.createBuffer(1, bufferSize, sampleRate);
            const output = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            hissBufferRef.current = buffer;
        }
    }, []);

    const startHiss = useCallback(() => {
        if (!audioContextRef.current || !hissBufferRef.current) return;

        // Stop existing hiss if any
        if (hissSourceRef.current) {
            hissSourceRef.current.stop();
        }

        const source = audioContextRef.current.createBufferSource();
        source.buffer = hissBufferRef.current;
        source.loop = true;

        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.value = 0.015; // Subtle tactical hiss

        source.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        source.start();
        hissSourceRef.current = source;
    }, []);

    const stopHiss = useCallback(() => {
        if (hissSourceRef.current) {
            hissSourceRef.current.stop();
            hissSourceRef.current = null;
        }
    }, []);

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        stopHiss();
        setIsPlaying(false);
    }, [stopHiss]);

    const vocalize = useCallback(async (text: string) => {
        // Ensure AudioContext is ready (user interaction)
        await initAudio();

        // Stop any current speech
        window.speechSynthesis.cancel();
        stopHiss();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // Voice Mapping
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            (v.name.includes('Google') && v.lang.startsWith('en-US')) ||
            (v.name.includes('Female')) ||
            (v.name.includes('Samantha')) // Common MacOS female voice
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        // Parameters for tactical tone
        utterance.pitch = 0.85;
        utterance.rate = 0.9;

        utterance.onstart = () => {
            setIsPlaying(true);
            startHiss();
        };

        utterance.onend = () => {
            setIsPlaying(false);
            stopHiss();
        };

        utterance.onerror = (event) => {
            console.error('Speech Synthesis Error:', event);
            setIsPlaying(false);
            stopHiss();
        };

        window.speechSynthesis.speak(utterance);
    }, [initAudio, startHiss, stopHiss]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            if (hissSourceRef.current) {
                hissSourceRef.current.stop();
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    return { vocalize, stop, isPlaying, isLoading: false };
};
