import React from 'react';

interface TTSButtonProps {
  isLoading: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const TTSButton: React.FC<TTSButtonProps> = ({ isLoading, isPlaying, onPlay, onStop }) => {
  const handleClick = () => {
    if (isPlaying) {
      onStop();
    } else {
      onPlay();
    }
  };

  const isDisabled = isLoading;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-gray-700 hover:bg-blue-600 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-wait"
      aria-label={isPlaying ? 'Stop reading chapter' : 'Read chapter aloud'}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : isPlaying ? (
        <StopIcon />
      ) : (
        <PlayIcon />
      )}
    </button>
  );
};

export default React.memo(TTSButton);