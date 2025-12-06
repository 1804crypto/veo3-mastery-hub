import React from 'react';
import CodeBlock from './CodeBlock';

interface CodeDisplayProps {
    code: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => {
    return (
        <pre className="bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto border border-gray-700">
            <CodeBlock code={code} />
        </pre>
    );
}

export default React.memo(CodeDisplay);