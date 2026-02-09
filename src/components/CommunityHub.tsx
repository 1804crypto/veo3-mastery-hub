
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import AbstractAvatar from './ui/icons/AbstractAvatar';
import { useCommunityAI } from '../hooks/useCommunity';
import { useVoiceOperator } from '../hooks/useVoiceOperator';

interface CommunityHubProps {
    hasAccess: boolean;
    openSubscriptionModal: () => void;
}

const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const LockedView: React.FC<{ onUpgrade: () => void }> = ({ onUpgrade }) => (
    <div className="flex items-center justify-center h-full">
        <Card className="max-w-lg text-center flex flex-col items-center">
            <LockIcon />
            <h2 className="font-heading text-4xl text-white mt-4">Join the Pro Community Hub</h2>
            <p className="text-gray-400 mt-2">
                This is a members-only space. Share your creations, get feedback from fellow VEO3 masters, and participate in exclusive discussions.
            </p>
            <Button onClick={onUpgrade} size="lg" className="mt-6">
                Upgrade to Pro
            </Button>
        </Card>
    </div>
);

interface Message {
    user: string;
    time: string;
    message: string;
}

const initialMessages: Message[] = [
    { user: 'CinephileMax', time: '2m ago', message: 'Just generated a Kurosawa-inspired shot with a telephoto lens that looks incredible. The compression is insane!' },
    { user: 'VFX_Wizard', time: '5m ago', message: 'Has anyone tried prompting for "impossible" camera moves that pass through solid objects? The results are wild.' },
    { user: 'Storyteller_AI', time: '1h ago', message: 'Pro tip: Layering ambient sound, SFX, and a musical score in the "Sounds" component makes a world of difference for immersion.' },
    { user: 'LightingGoddess', time: '3h ago', message: 'I\'m obsessed with using Rembrandt lighting in my prompts. It adds so much drama to character close-ups.' },
];

const mockGallery = [
    { title: 'Cyberpunk Alley Chase', user: 'Neon_Runner', image: 'https://images.unsplash.com/photo-1579566346927-c68383817a25?q=80&w=800' },
    { title: 'Enchanted Forest Discovery', user: 'MythicFrames', image: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=800' },
    { title: 'Noir Detective\'s Office', user: 'ShadowCaster', image: 'https://images.unsplash.com/photo-1616528518428-6a7201c3d140?q=80&w=800' },
];

const CommunityHub: React.FC<CommunityHubProps> = ({ hasAccess, openSubscriptionModal }) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const { mutateAsync: getAIReply, isPending: isAiThinking } = useCommunityAI();
    const { vocalize, stop, isPlaying } = useVoiceOperator();

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping, isAiThinking]);

    const handleSendMessage = useCallback(async () => {
        if (newMessage.trim() === '' || isTyping || isAiThinking) return;

        const userMessage: Message = { user: 'You', time: 'Just now', message: newMessage };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setNewMessage('');

        try {
            const aiReplyText = await getAIReply({ userMessage: newMessage, chatHistory: messages });
            const botMessage: Message = { user: 'AI_Assistant', time: 'Just now', message: aiReplyText };
            setMessages(prev => [...prev, botMessage]);

            // Auto-vocalize AI assistant replies
            vocalize(aiReplyText);
        } catch (error) {
            console.error("Failed to get AI reply", error);
        }

    }, [newMessage, isTyping, isAiThinking, messages, getAIReply, vocalize]);

    if (!hasAccess) {
        return <LockedView onUpgrade={openSubscriptionModal} />;
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl text-center mb-8 text-white">Community Hub</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chat Feed */}
                <div className="lg:col-span-2">
                    <Card className="h-full flex flex-col">
                        <h2 className="font-heading text-3xl text-blue-300 border-b border-gray-700 pb-2 mb-4">Live Discussion</h2>
                        <div ref={chatContainerRef} className="flex-grow space-y-4 overflow-y-auto pr-2 max-h-[600px]">
                            {messages.map((msg, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full flex-shrink-0">
                                        <AbstractAvatar name={msg.user} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2">
                                            <p className={`font-bold ${msg.user === 'You' ? 'text-blue-300' : (msg.user === 'AI_Assistant' ? 'text-green-300' : 'text-white')}`}>{msg.user}</p>
                                            <p className="text-xs text-gray-500">{msg.time}</p>
                                            <button
                                                onClick={() => vocalize(msg.message)}
                                                className="ml-auto text-gray-500 hover:text-blue-400 transition-colors"
                                                title="Read message aloud"
                                            >
                                                <SpeakerIcon />
                                            </button>
                                        </div>
                                        <p className="text-gray-300">{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                            {(isTyping || isAiThinking) && (
                                <div className="flex items-start gap-3 animate-pulse">
                                    <div className="w-10 h-10 rounded-full flex-shrink-0">
                                        <AbstractAvatar name="AI_Assistant" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-green-300">AI_Assistant</p>
                                        <p className="text-gray-400 text-sm">is typing...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Share an idea or ask a question..."
                                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isTyping || isAiThinking}
                            />
                            <Button onClick={handleSendMessage} disabled={isTyping || isAiThinking || !newMessage.trim()}>Send</Button>
                        </div>
                    </Card>
                </div>

                {/* Shared Work Gallery */}
                <div>
                    <Card>
                        <h2 className="font-heading text-3xl text-blue-300 border-b border-gray-700 pb-2 mb-4">Inspiration Gallery</h2>
                        <div className="space-y-4">
                            {mockGallery.map((item, index) => (
                                <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                                    <img src={`${item.image}&fit=crop&h=200&w=400`} alt={item.title} className="w-full h-32 object-cover rounded-md mb-2" />
                                    <h3 className="font-bold text-white">{item.title}</h3>
                                    <p className="text-sm text-gray-400">by {item.user}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CommunityHub;
