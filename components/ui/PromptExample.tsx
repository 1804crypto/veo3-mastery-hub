import React from 'react';
import CodeBlock from './CodeBlock';

interface PromptExampleProps {
  title?: string;
  code: string;
  language?: 'json' | 'text';
}

const PromptExample: React.FC<PromptExampleProps> = ({ title = 'Prompt Example', code, language = 'text' }) => {
  return (
    <div className="my-6 not-prose">
      <fieldset className="border border-gray-700 rounded-lg p-0">
        <legend className="px-2 text-sm font-semibold text-blue-300 tracking-wide font-sans ml-4">
          {title}
        </legend>
        <pre className="px-4 pb-4 pt-2 text-sm overflow-x-auto">
          {language === 'json' ? (
            <CodeBlock code={code} />
          ) : (
            <code className="text-gray-300 whitespace-pre-wrap break-words">{code}</code>
          )}
        </pre>
      </fieldset>
    </div>
  );
};

export default React.memo(PromptExample);