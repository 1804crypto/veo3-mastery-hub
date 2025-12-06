import React from 'react';

interface CodeBlockProps {
  code: string;
  className?: string;
}

// Simple syntax highlighter for JSON
const highlightJson = (jsonString: string) => {
  return jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
    let cls = 'text-green-400'; // string
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-blue-400'; // key
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-purple-400'; // boolean
    } else if (/null/.test(match)) {
      cls = 'text-gray-500'; // null
    } else {
      cls = 'text-yellow-400' // number
    }
    return `<span class="${cls}">${match}</span>`;
  });
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, className = '' }) => {
  const highlightedCode = highlightJson(code);
  return (
    <code className={className} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
  );
};

export default React.memo(CodeBlock);