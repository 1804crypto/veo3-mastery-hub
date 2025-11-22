import React, { useState, useEffect } from 'react';
import { journeyContent } from '../constants';
import Card from './ui/Card';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import TTSButton from './ui/TTSButton';

const LearningJourney: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState(0);
  const { play, stop, isLoading, isPlaying } = useTextToSpeech();

  // Stop playback when the chapter changes or component unmounts
  useEffect(() => {
    return () => {
      stop();
    };
  }, [activeChapter, stop]);

  const ChapterContent = journeyContent[activeChapter].content;
  const chapterText = journeyContent[activeChapter].text;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-1/4 xl:w-1/5">
        <div className="sticky top-24">
          <h2 className="font-heading text-3xl mb-4 text-blue-400">Chapters</h2>
          <nav className="flex flex-col space-y-2">
            {journeyContent.map((chapter, index) => (
              <button
                key={index}
                onClick={() => setActiveChapter(index)}
                className={`text-left px-4 py-2 rounded-md transition-all duration-200 text-sm ${
                  activeChapter === index
                    ? 'bg-blue-500/20 text-blue-300 border-l-4 border-blue-400 font-bold'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                {`${index + 1}. ${chapter.title}`}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      <section className="lg:w-3/4 xl:w-4/5">
        <Card>
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-700">
            <h2 className="font-heading text-4xl md:text-5xl text-white">
              {journeyContent[activeChapter].title}
            </h2>
            <TTSButton
              isLoading={isLoading}
              isPlaying={isPlaying}
              onPlay={() => play(chapterText)}
              onStop={stop}
            />
          </div>
          <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-blue-300 prose-headings:font-heading prose-strong:text-white prose-a:text-blue-400 prose-ul:list-disc prose-li:marker:text-blue-400">
            <ChapterContent />
          </div>
        </Card>
      </section>
    </div>
  );
};

export default LearningJourney;
