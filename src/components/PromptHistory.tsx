import React from 'react';
import { usePromptHistory, useDeletePromptHistory, useClearPromptHistory } from '../hooks/usePrompt';

import { useToast } from '../contexts/ToastContext';
import Button from './ui/Button';
import CodeDisplay from './ui/CodeDisplay';

interface PromptHistoryProps {
  userId: string;
  isCard?: boolean; // Controls whether to wrap in a card or just provide the content
}

const PromptHistory: React.FC<PromptHistoryProps> = ({ userId, isCard = true }) => {
  const { data: history = [] } = usePromptHistory(userId);
  const { mutate: deleteItem } = useDeletePromptHistory();
  const { mutate: clearHistory } = useClearPromptHistory();
  const { addToast } = useToast();

  const copyPrompt = (prompt: object) => {
    navigator.clipboard.writeText(JSON.stringify(prompt, null, 2));
    addToast('Prompt copied to clipboard!', 'success');
  };

  const deleteHistoryItem = (id: string) => {
    deleteItem({ userId, id });
    addToast('History item deleted.', 'info');
  };

  const clearAllHistory = () => {
    if (confirm('Are you sure you want to delete your entire prompt history? This cannot be undone.')) {
      clearHistory(userId);
      addToast('Prompt history cleared.', 'info');
    }
  };

  const title = isCard ? "Recent Prompts" : "Prompt History";

  const content = (
    <>
      <div className={`flex justify-between items-center ${isCard ? 'mb-4' : 'border-b border-gray-700 pb-2 mb-4'}`}>
        <h3 className={`font-heading text-3xl ${!isCard && 'text-blue-300'}`}>{title}</h3>
        {history.length > 0 && (
          <Button onClick={clearAllHistory} variant="secondary" size="sm" className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/40">
            {isCard ? 'Clear History' : 'Clear All'}
          </Button>
        )}
      </div>
      <div className={`space-y-4 max-h-96 overflow-y-auto pr-2 ${isCard ? 'bg-gray-800/50 border border-gray-700 rounded-lg p-4' : ''}`}>
        {history.length > 0 ? (
          history.map(item => (
            <div key={item.id} className="bg-gray-700/50 p-3 rounded-lg">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-grow">
                  <p className="font-semibold text-gray-300 text-sm break-words">{item.idea}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center flex-shrink-0 gap-2">
                  <Button onClick={() => copyPrompt(item.prompt)} size="sm" variant="secondary">Copy</Button>
                  <Button onClick={() => deleteHistoryItem(item.id)} size="sm" variant="secondary" className="bg-red-500/10 hover:bg-red-500/30 text-red-300 border-none w-8 h-8 p-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </Button>
                </div>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-blue-400">View Prompt</summary>
                <div className="mt-2">
                  <CodeDisplay code={JSON.stringify(item.prompt, null, 2)} />
                </div>
              </details>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Your prompt generation history will appear here.</p>
        )}
      </div>
    </>
  );

  if (!isCard) {
    return content;
  }

  return history.length > 0 ? content : null;
};

export default PromptHistory;
