import React from 'react';

interface AbstractAvatarProps {
  name: string;
  size?: number;
}

// Simple hash function to get a number from a string
const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const AbstractAvatar: React.FC<AbstractAvatarProps> = ({ name, size = 40 }) => {
  const hash = stringToHash(name);

  // Generate 3 unique colors from the hash
  const colors = [
    `hsl(${hash % 360}, 70%, 50%)`,
    `hsl(${(hash * 2) % 360}, 70%, 60%)`,
    `hsl(${(hash * 3) % 360}, 70%, 40%)`,
  ];

  const id = `gradient-${hash}`;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: colors[0] }} />
          <stop offset="100%" style={{ stopColor: colors[1] }} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill={`url(#${id})`} />
      <path
        d={`M ${20 + (hash % 10)} ${30 + (hash % 15)} 
             C ${40 + (hash % 10)} ${20 - (hash % 10)}, 
               ${60 - (hash % 15)} ${40 + (hash % 20)}, 
               ${80 - (hash % 5)} ${70 - (hash % 10)}`}
        fill="none"
        stroke={colors[2]}
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.8"
        transform={`rotate(${(hash % 360)} 50 50)`}
      />
       <path
        d={`M ${30 - (hash % 10)} ${70 - (hash % 15)} 
             C ${40 - (hash % 10)} ${80 + (hash % 10)}, 
               ${60 + (hash % 15)} ${60 - (hash % 20)}, 
               ${70 + (hash % 5)} ${30 + (hash % 10)}`}
        fill="none"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.6"
        transform={`rotate(${((hash * 2) % 360)} 50 50) scale(0.8)`}
      />
    </svg>
  );
};

export default React.memo(AbstractAvatar);
