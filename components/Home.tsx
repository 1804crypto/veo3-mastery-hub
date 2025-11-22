import React from 'react';
import Button from './ui/Button';
import { Page } from '../src/types';

interface HomeProps {
  navigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ navigate }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center">
      <div
        className="w-full max-w-5xl bg-gray-800/50 rounded-2xl p-8 md:p-16 shadow-2xl shadow-black/50 border border-gray-700"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(31, 41, 55, 0.5) 0%, rgba(17, 24, 39, 0.8) 70%)'
        }}
      >
        <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl tracking-wider text-white">
          Unlock Hollywood-Grade AI Video
        </h2>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
          Master the art of cinematic prompting for VEO3. Go from a simple idea to a blockbuster-level shot with our guided journey and professional-grade AI prompt generator.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button onClick={() => navigate('journey')} size="lg" variant="primary">
            Start the Learning Journey
          </Button>
          <Button onClick={() => navigate('generator')} size="lg" variant="secondary">
            Go to Prompt Generator
          </Button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <FeatureCard
          title="Guided Learning Journey"
          description="Follow a structured path from fundamentals to advanced techniques, based on expert cinematic research."
        />
        <FeatureCard
          title="AI Prompt Generator"
          description="Subscribe to access our Cine-Maestro GPT, which transforms your ideas into professional, VEO3-ready JSON prompts."
        />
        <FeatureCard
          title="Pro Community Hub"
          description="Join a members-only space to share your creations, get feedback, and collaborate with other VEO3 masters."
        />
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = React.memo(({ title, description }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-left">
      <h3 className="font-heading text-3xl text-blue-400">{title}</h3>
      <p className="mt-2 text-gray-400">{description}</p>
    </div>
  );
});


export default Home;