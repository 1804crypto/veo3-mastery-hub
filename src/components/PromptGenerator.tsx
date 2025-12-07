import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeneratePrompt, useAddPromptHistory, useEnhancePrompt } from '../hooks/usePrompt';
import Button from './ui/Button';
import CodeDisplay from './ui/CodeDisplay';
import { VEO3Prompt, VEO3InnerPrompt, PromptHistoryItem } from '../types';
import { useToast } from '../contexts/ToastContext';
import PromptHistory from './PromptHistory';
import Tooltip from './ui/Tooltip';
import InfoIcon from './ui/icons/InfoIcon';
import { AuthTab } from './AuthModal';

// Tooltip content mapping
const tooltipContent: Record<keyof VEO3InnerPrompt, React.ReactNode> = {
  Subject: (
    <>
      <p className="font-bold mb-1">Subject Definition</p>
      <p>Define the main character or object with at least 15 attributes (age, clothing, build) to ensure consistency across shots.</p>
      <p className="mt-2 text-xs text-blue-400">See Learning Journey: Chapter 5</p>
    </>
  ),
  Action: (
    <>
      <p className="font-bold mb-1">Action Choreography</p>
      <p>Describe the action using physics-based keywords (e.g., &quot;heavy,&quot; &quot;momentum,&quot; &quot;shifts weight&quot;) for more realistic movement.</p>
      <p className="mt-2 text-xs text-blue-400">See Learning Journey: Chapter 7</p>
    </>
  ),
  Scene: (
    <>
      <p className="font-bold mb-1">Scene Creation</p>
      <p>Describe the environment in three layers: Foreground, Mid-ground, and Background for cinematic depth.</p>
      <p className="mt-2 text-xs text-blue-400">See Learning Journey: Chapter 6</p>
    </>
  ),
  Style: (
    <>
      <p className="font-bold mb-1">Cinematic Style</p>
      <p>Specify the complete cinematic style: include Camera Shot, Angle, Movement, Lens, Lighting, and Color Grade.</p>
      <p className="mt-2 text-xs text-blue-400">See Learning Journey: Chapters 3, 4, & 8</p>
    </>
  ),
  Dialogue: (
    <>
      <p className="font-bold mb-1">Dialogue</p>
      <p>Use the format: <code className="text-xs bg-gray-700 p-1 rounded">(Character): &quot;Line here&quot;</code> to ensure proper lip-sync and avoid subtitles.</p>
      <p className="mt-2 text-xs text-blue-400">See Learning Journey: Chapter 10</p>
    </>
  ),
  Sounds: (
    <>
      <p className="font-bold mb-1">Audio Design</p>
      <p>Define Ambient sounds, specific Sound Effects (SFX), and a Musical Score for a fully immersive audio experience.</p>
      <p className="mt-2 text-xs text-blue-400">See Learning Journey: Chapter 9</p>
    </>
  ),
  Technical: (
    <>
      <p className="font-bold mb-1">Technical / Negative Prompt</p>
      <p>Include a comprehensive negative prompt to prevent common AI artifacts (e.g., &quot;mangled hands, blurry, watermark&quot;).</p>
      <p className="mt-2 text-xs text-blue-400">See Learning Journey: Chapter 15</p>
    </>
  ),
};


// --- Start of Additions for Enhanced Editor ---

// Helper Icon Components
const DragHandleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-500 cursor-grab active:cursor-grabbing">
    <circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle>
    <circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle>
  </svg>
);
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const LightbulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const MagicWandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);


// Real-time Validation Logic
type ValidationResult = {
  type: 'good' | 'suggestion';
  message: string;
} | null;

const validatePromptComponent = (key: keyof VEO3InnerPrompt, value: string): ValidationResult => {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  switch (key) {
    case 'Subject':
      if (wordCount > 15) return { type: 'good', message: 'Excellent detail! This helps ensure character consistency.' };
      if (wordCount > 8) return { type: 'suggestion', message: 'Good start. Consider adding more specifics like age, build, or accessories.' };
      return { type: 'suggestion', message: 'For best results, describe the subject with at least 15 attributes (age, hair, clothing, etc.).' };
    case 'Action': {
      const hasPhysicsWord = /heavy|momentum|weight|sluggish|shifts|braces|recoils|tremble/i.test(value);
      if (hasPhysicsWord && wordCount > 10) return { type: 'good', message: 'Great use of physics-aware language to describe the motion.' };
      if (wordCount > 5) return { type: 'suggestion', message: 'Try using physics-based keywords (e.g., &quot;heavy,&quot; &quot;momentum,&quot; &quot;shifts weight&quot;) for more realistic movement.' };
      return { type: 'suggestion', message: 'Describe the action with a focus on realistic physics and biomechanics.' };
    }
    case 'Scene': {
      const hasLayers = /foreground|mid-ground|background/i.test(value);
      if (hasLayers) return { type: 'good', message: 'Excellent use of the 3-layer structure for a deep, immersive scene.' };
      if (wordCount > 10) return { type: 'suggestion', message: 'Consider defining the scene in three layers: Foreground, Mid-ground, and Background for more depth.' };
      return { type: 'suggestion', message: 'Build a rich environment by describing the Foreground, Mid-ground, and Background.' };
    }
    case 'Style': {
      const hasShot = /shot|angle/i.test(value);
      const hasLens = /lens|mm/i.test(value);
      const hasMovement = /dolly|tracking|crane|handheld/i.test(value);
      const hasLighting = /lighting|chiaroscuro|rembrandt/i.test(value);
      if (hasShot && hasLens && hasMovement && hasLighting) return { type: 'good', message: 'Comprehensive cinematic style. This gives VEO3 precise instructions.' };
      return { type: 'suggestion', message: 'Define the complete cinematic style: include Camera Shot, Angle, Movement, Lens, and Lighting.' };
    }
    case 'Dialogue':
      if (value.trim() === '') return null; // No validation needed if empty
      if (/.+:\s*".+"/i.test(value)) return { type: 'good', message: 'Correctly formatted dialogue ensures proper lip-sync.' };
      return { type: 'suggestion', message: 'Use the format: (Character Name): &quot;Dialogue here&quot; to ensure lip-sync and avoid subtitles.' };
    case 'Sounds': {
      const hasAmbient = /ambient|background/i.test(value);
      const hasSfx = /sfx|sound effect|clink|thud/i.test(value);
      const hasScore = /score|music|orchestral|synthesizer/i.test(value);
      if (hasAmbient && hasSfx && hasScore) return { type: 'good', message: 'A complete soundscape! This creates a fully immersive experience.' };
      return { type: 'suggestion', message: 'For a rich audio experience, define Ambient sounds, SFX, and a Musical Score.' };
    }
    case 'Technical':
      if (wordCount > 10) return { type: 'good', message: 'This strong negative prompt will help prevent common AI artifacts.' };
      return { type: 'suggestion', message: 'Include a comprehensive negative prompt to improve quality (e.g., &quot;mangled hands, blurry, watermark, bad composition&quot;).' };
    default:
      return null;
  }
};

// --- End of Additions ---

const InteractivePromptEditor: React.FC<{
  promptData: VEO3InnerPrompt;
  onUpdate: (updatedData: VEO3InnerPrompt) => void;
}> = React.memo(({ promptData, onUpdate }) => {
  const [editableData, setEditableData] = useState(promptData);
  const [componentOrder, setComponentOrder] = useState<Array<keyof VEO3InnerPrompt>>([]);
  const [validationFeedback, setValidationFeedback] = useState<Record<string, ValidationResult>>({});
  const [enhancingKey, setEnhancingKey] = useState<string | null>(null);

  const { mutateAsync: enhancePrompt } = useEnhancePrompt();
  const { addToast } = useToast();

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    const initialOrder = Object.keys(promptData) as Array<keyof VEO3InnerPrompt>;
    setComponentOrder(initialOrder);
    setEditableData(promptData);

    const initialFeedback: Record<string, ValidationResult> = {};
    initialOrder.forEach(key => {
      initialFeedback[key] = validatePromptComponent(key, promptData[key]);
    });
    setValidationFeedback(initialFeedback);
  }, [promptData]);

  const handleChange = (key: keyof VEO3InnerPrompt, value: string) => {
    const newData = { ...editableData, [key]: value };
    setEditableData(newData);
    setValidationFeedback(prev => ({
      ...prev,
      [key]: validatePromptComponent(key, value)
    }));

    const reorderedData: VEO3InnerPrompt = {} as VEO3InnerPrompt;
    componentOrder.forEach(k => {
      reorderedData[k] = newData[k];
    });
    onUpdate(reorderedData);
  };

  const handleEnhance = async (key: keyof VEO3InnerPrompt) => {
    if (enhancingKey) return;
    setEnhancingKey(key);
    try {
      const enhancedText = await enhancePrompt({
        component: key,
        currentValue: editableData[key],
        context: JSON.stringify(editableData)
      });
      handleChange(key, enhancedText);
      addToast('Enhanced with AI Ghostwriter!', 'success');
    } catch (error) {
      addToast('Failed to enhance text.', 'error');
    } finally {
      setEnhancingKey(null);
    }
  };

  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) return;

    const newOrder = [...componentOrder];
    const draggedItemContent = newOrder.splice(dragItem.current, 1)[0];
    newOrder.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;
    setComponentOrder(newOrder);

    const reorderedData: VEO3InnerPrompt = {} as VEO3InnerPrompt;
    newOrder.forEach(key => {
      reorderedData[key] = editableData[key];
    });
    onUpdate(reorderedData);
  };

  const getValidationUI = (key: string) => {
    const feedback = validationFeedback[key];
    if (!feedback) return { borderColor: 'border-gray-600', feedbackElement: null };

    const iconMap = { good: <CheckIcon />, suggestion: <LightbulbIcon /> };
    const colorMap = {
      good: { text: 'text-green-400', border: 'border-green-500/50' },
      suggestion: { text: 'text-yellow-400', border: 'border-yellow-500/50' },
    };

    const { text, border } = colorMap[feedback.type];

    return {
      borderColor: border,
      feedbackElement: (
        <div className={`flex items-center gap-2 mt-2 text-xs ${text}`}>
          <div className="flex-shrink-0">{iconMap[feedback.type]}</div>
          <span>{feedback.message}</span>
        </div>
      )
    };
  };

  return (
    <div className="space-y-4">
      {componentOrder.map((key, index) => {
        const { borderColor, feedbackElement } = getValidationUI(key);
        const isEnhancing = enhancingKey === key;

        return (
          <div
            key={key}
            draggable
            onDragStart={() => {
              dragItem.current = index;
              setDraggedIndex(index);
            }}
            onDragEnter={() => {
              dragOverItem.current = index;
              setDragOverIndex(index);
            }}
            onDragLeave={() => setDragOverIndex(null)}
            onDragEnd={() => {
              handleDragSort();
              setDraggedIndex(null);
              setDragOverIndex(null);
            }}
            onDragOver={(e) => e.preventDefault()}
            className={`p-3 bg-gray-800/50 border border-gray-700 rounded-lg transition-all duration-200 relative ${draggedIndex === index ? 'opacity-40' : 'opacity-100'}`}
          >
            {dragOverIndex === index && draggedIndex !== index && (
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 rounded-full" />
            )}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div draggable><DragHandleIcon /></div>
                <div className="flex items-center gap-2 ml-2">
                  <label className="block text-sm font-medium text-blue-300">{key}</label>
                  <Tooltip content={tooltipContent[key]}>
                    <InfoIcon />
                  </Tooltip>
                </div>
              </div>
              <button
                onClick={() => handleEnhance(key)}
                disabled={isEnhancing}
                className={`p-1 rounded-full transition-colors ${isEnhancing ? 'text-blue-400 animate-pulse' : 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/20'}`}
                title="Enhance with AI Ghostwriter"
              >
                {isEnhancing ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <MagicWandIcon />
                )}
              </button>
            </div>
            <textarea
              value={editableData[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              disabled={isEnhancing}
              className={`w-full h-24 p-2 bg-gray-900 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors text-sm ${borderColor} ${isEnhancing ? 'opacity-50 cursor-wait' : ''}`}
            />
            {feedbackElement}
          </div>
        );
      })}
    </div>
  );
});

interface PromptGeneratorProps {
  hasAccess: boolean;
  openSubscriptionModal: (reason: 'upgrade' | 'limit_reached') => void;
  userId: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  openAuthModal: (tab?: AuthTab) => void;
}

const PromptGenerator: React.FC<PromptGeneratorProps> = ({ hasAccess, openSubscriptionModal, userId, isAuthenticated, openAuthModal }) => {
  const [freeUses, setFreeUses] = useState(5);
  const [limitTimestamp, setLimitTimestamp] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [idea, setIdea] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState<VEO3Prompt | null>(null);
  const [editableInnerPrompt, setEditableInnerPrompt] = useState<VEO3InnerPrompt | null>(null);

  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasAccess) return;

    const usageDataString = localStorage.getItem('veo3_prompt_usage');
    if (usageDataString) {
      const usageData = JSON.parse(usageDataString);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      if (usageData.limitTimestamp && now - usageData.limitTimestamp > oneDay) {
        localStorage.removeItem('veo3_prompt_usage');
        setFreeUses(5);
        setLimitTimestamp(null);
      } else {
        setFreeUses(usageData.uses ?? 5);
        setLimitTimestamp(usageData.limitTimestamp ?? null);
      }
    }
  }, [hasAccess]);

  useEffect(() => {
    if (limitTimestamp) {
      const interval = setInterval(() => {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const timeLeft = limitTimestamp + oneDay - now;

        if (timeLeft <= 0) {
          setTimeRemaining('');
          clearInterval(interval);
          localStorage.removeItem('veo3_prompt_usage');
          setFreeUses(5);
          setLimitTimestamp(null);
        } else {
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
          const seconds = Math.floor((timeLeft / 1000) % 60);
          setTimeRemaining(`${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [limitTimestamp]);


  const { mutateAsync: generatePrompt, isPending: isGenerating } = useGeneratePrompt();
  const { mutate: addToHistory } = useAddPromptHistory();

  // ... (keep existing useEffects for usage limits)

  const handleGenerate = useCallback(async () => {
    if (!idea.trim()) {
      setError('Please enter your video idea first.');
      return;
    }

    // Allow guest access if they have free uses
    if (!isAuthenticated && freeUses <= 0) {
      addToast('You have reached your daily free limit. Please sign up for more.', 'info');
      openAuthModal('signup');
      return;
    }

    if (!hasAccess && freeUses <= 0) {
      openSubscriptionModal('limit_reached');
      return;
    }

    setError(null);
    setGeneratedPrompt(null);
    setEditableInnerPrompt(null);

    try {
      if (!hasAccess) {
        const newUses = freeUses - 1;
        setFreeUses(newUses);
        const newUsageData: { uses: number; limitTimestamp?: number | null } = { uses: newUses, limitTimestamp: null };
        if (newUses <= 0) {
          const now = Date.now();
          newUsageData.limitTimestamp = now;
          setLimitTimestamp(now);
        }
        localStorage.setItem('veo3_prompt_usage', JSON.stringify(newUsageData));
      }

      const result = await generatePrompt(idea);
      setGeneratedPrompt(result);
      try {
        const innerPrompt = JSON.parse(result.veo3_prompt);
        setEditableInnerPrompt(innerPrompt);
      } catch {
        setEditableInnerPrompt(null);
      }

      if (isAuthenticated && userId) {
        const newHistoryItem: Omit<PromptHistoryItem, 'id'> = {
          createdAt: new Date().toISOString(),
          idea: idea,
          prompt: result,
        };
        addToHistory({ userId, item: newHistoryItem });
      }
    } catch (err) {
      console.error('Error generating prompt:', err);
      setError('Failed to generate prompt. Please try again.');
    }
  }, [idea, freeUses, hasAccess, openSubscriptionModal, isAuthenticated, userId, addToast, openAuthModal, generatePrompt, addToHistory]);

  const copyPrompt = (prompt: object) => {
    navigator.clipboard.writeText(JSON.stringify(prompt, null, 2));
    addToast("Prompt copied to clipboard!", 'success');
  };

  const handleEditorUpdate = (updatedData: VEO3InnerPrompt) => {
    setEditableInnerPrompt(updatedData);
    if (generatedPrompt) {
      setGeneratedPrompt({
        ...generatedPrompt,
        veo3_prompt: JSON.stringify(updatedData, null, 2),
      });
    }
  };

  const handleGenerateVideo = () => {
    if (generatedPrompt?.veo3_prompt) {
      navigate('/studio', { state: { prompt: generatedPrompt.veo3_prompt } });
    } else {
      addToast('Cannot generate video without a valid prompt.', 'error');
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="font-heading text-4xl md:text-5xl text-center mb-2 text-white">VEO3 Prompt Generator</h2>
      <p className="text-center text-gray-400 mb-6">
        Describe your video idea, and let Cine-Maestro craft the perfect JSON prompt for you.
      </p>

      {isAuthenticated && !hasAccess && (
        <div className="text-center bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 rounded-lg py-2 px-4 mb-6">
          You have <span className="font-bold">{freeUses}</span> free generation{freeUses !== 1 ? 's' : ''} remaining today.
        </div>
      )}

      {timeRemaining && !hasAccess && (
        <div className="text-center bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg py-3 px-4 mb-6">
          You are out of free generations. Your credits will recharge in <span className="font-bold tabular-nums">{timeRemaining}</span>.
        </div>
      )}

      <div className="space-y-6">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g., A noir detective in a late-night diner at 3am, exhausted from his shift, confessing his struggles. Make it melancholic with a Hopper 'Nighthawks' vibe."
          className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
          disabled={isAuthenticated && !hasAccess && freeUses <= 0}
        />
        <Button onClick={handleGenerate} disabled={isGenerating || (!hasAccess && freeUses <= 0)} size="lg" className="w-full">
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </div>
          ) : 'Generate Prompt'}
        </Button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {generatedPrompt && (
        <div className="mt-8 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-3xl">Generated JSON Prompt</h3>
              <Button onClick={() => copyPrompt(generatedPrompt)} variant="secondary" size="sm">
                Copy
              </Button>
            </div>
            <CodeDisplay code={JSON.stringify(generatedPrompt, null, 2)} />
          </div>

          {editableInnerPrompt && (
            <div>
              <h3 className="font-heading text-3xl mb-4">Interactive Prompt Editor</h3>
              <InteractivePromptEditor
                promptData={editableInnerPrompt}
                onUpdate={handleEditorUpdate}
              />
            </div>
          )}

          <div className="bg-gray-800/50 border border-blue-500/30 rounded-lg p-6 text-center">
            <h4 className="font-heading text-2xl text-blue-300">Ready to bring this to life?</h4>
            <p className="text-gray-400 mt-2 mb-4">Take your final prompt to the Video Studio to generate your cinematic shot using the VEO model.</p>
            <Button onClick={handleGenerateVideo} size="lg" variant="primary">
              Generate Video with this Prompt &rarr;
            </Button>
          </div>
        </div>
      )}

      {isAuthenticated && userId && (
        <div className="mt-12">
          <PromptHistory userId={userId} />
        </div>
      )}
    </div>
  );
};

export default PromptGenerator;