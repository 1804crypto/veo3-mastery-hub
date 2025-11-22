import { useState, useRef, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { decode, decodeAudioData } from '../utils/audio';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

// Gemini TTS returns audio at 24000 sample rate
const OUTPUT_SAMPLE_RATE = 24000;

const generateSpeech = async (text: string) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL || process.env.VITE_API_BASE_URL || '';
  const response = await fetch(`${apiUrl}/api/generate-speech`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch audio from the server.');
  }

  const { audioContent } = await response.json();
  if (!audioContent) {
    throw new Error("No audio data was returned from the API.");
  }
  return audioContent;
};

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const isCancelledRef = useRef(false);

  const { mutateAsync: generateAudio, isPending: isLoading } = useMutation({
    mutationFn: generateSpeech,
  });

  // This effect ensures that any ongoing audio is stopped when the component using the hook unmounts.
  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
        } catch (e) {
          // Can throw if not playing
        }
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }
      setIsPlaying(false);
    };
  }, []);

  const stop = useCallback(() => {
    isCancelledRef.current = true;
    if (sourceNodeRef.current) {
      sourceNodeRef.current.onended = null; // Prevent onended from firing on manual stop
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        // Can throw if already stopped or not started
      }
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback(async (text: string) => {
    if (isLoading) return;
    if (isPlaying) {
      stop();
      return;
    }

    isCancelledRef.current = false;

    try {
      const base64Audio = await generateAudio(text);

      if (isCancelledRef.current) return;

      const localAudioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: OUTPUT_SAMPLE_RATE,
      });
      audioContextRef.current = localAudioContext;

      const audioBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(
        audioBytes,
        localAudioContext,
        OUTPUT_SAMPLE_RATE,
        1,
      );

      if (isCancelledRef.current) {
        localAudioContext.close();
        return;
      }

      const source = localAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(localAudioContext.destination);
      source.onended = () => {
        if (sourceNodeRef.current === source) {
          stop();
        }
      };
      source.start();
      sourceNodeRef.current = source;
      setIsPlaying(true);
    } catch (error) {
      if (!isCancelledRef.current) {
        console.error('Text-to-speech generation failed:', error);
        alert('Failed to generate audio. Please try again.');
      }
    }
  }, [isLoading, isPlaying, stop, generateAudio]);

  return { play, stop, isLoading, isPlaying };
};