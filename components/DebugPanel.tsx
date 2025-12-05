import React, { useState, useEffect } from 'react';
import { api } from '../src/lib/api';

interface LogEntry {
    type: 'request' | 'response' | 'error';
    method?: string;
    url?: string;
    status?: number;
    timestamp: Date;
    data?: any;
}

const DebugPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [health, setHealth] = useState<'checking' | 'ok' | 'error'>('checking');
    const [baseUrl, setBaseUrl] = useState('');

    const appApiUrl = import.meta.env.VITE_APP_API_URL;
    const apiUrl = import.meta.env.VITE_API_URL;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    setBaseUrl(appApiUrl || apiUrl || apiBaseUrl || 'Default (Render)');
    checkHealth();

    // Override console.log/error to capture API logs
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
        originalLog(...args);
        const msg = args[0];
        if (typeof msg === 'string' && msg.startsWith('[API')) {
            addLog('request', args);
        }
    };

    console.error = (...args) => {
        originalError(...args);
        const msg = args[0];
        if (typeof msg === 'string' && msg.startsWith('[API')) {
            addLog('error', args);
        }
    };

    return () => {
        console.log = originalLog;
        console.error = originalError;
    };
}, []);

const addLog = (type: 'request' | 'response' | 'error', args: any[]) => {
    setLogs(prev => [{
        type,
        timestamp: new Date(),
        data: args.join(' '),
    }, ...prev].slice(0, 20));
};

const checkHealth = async () => {
    setHealth('checking');
    try {
        await api.get('/health');
        setHealth('ok');
    } catch (e) {
        setHealth('error');
    }
};

if (!isOpen) {
    return (
        <button
            onClick={() => setIsOpen(true)}
            style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                zIndex: 9999,
                background: health === 'ok' ? '#22c55e' : '#ef4444',
                color: 'white',
                padding: '8px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                fontSize: '10px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
        >
            DBUG
        </button>
    );
}

return (
    <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        width: '400px',
        height: '500px',
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #333',
        borderRadius: '8px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        fontFamily: 'monospace',
        fontSize: '12px'
    }}>
        <div style={{ padding: '10px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#262626' }}>
            <span style={{ fontWeight: 'bold' }}>Debug Panel</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ padding: '10px', borderBottom: '1px solid #333' }}>
            <div><strong>Resolved Base URL:</strong> {baseUrl}</div>
            <div style={{ marginTop: '5px', fontSize: '10px', color: '#999' }}>
                <div>VITE_APP_API_URL: {import.meta.env.VITE_APP_API_URL || '(not set)'}</div>
                <div>VITE_API_URL: {import.meta.env.VITE_API_URL || '(not set)'}</div>
                <div>VITE_API_BASE_URL: {import.meta.env.VITE_API_BASE_URL || '(not set)'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                <strong>Status:</strong>
                <span style={{
                    marginLeft: '5px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: health === 'ok' ? '#059669' : health === 'checking' ? '#d97706' : '#dc2626',
                    fontSize: '10px'
                }}>
                    {health.toUpperCase()}
                </span>
                <button onClick={checkHealth} style={{ marginLeft: 'auto', padding: '2px 5px', fontSize: '10px', cursor: 'pointer' }}>Retry</button>
            </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {logs.map((log, i) => (
                <div key={i} style={{
                    padding: '5px',
                    borderRadius: '4px',
                    background: log.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    borderLeft: `3px solid ${log.type === 'error' ? '#ef4444' : '#3b82f6'}`
                }}>
                    <div style={{ opacity: 0.7, fontSize: '10px' }}>{log.timestamp.toLocaleTimeString()}</div>
                    <div style={{ wordBreak: 'break-all' }}>{log.data}</div>
                </div>
            ))}
            {logs.length === 0 && <div style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>No logs yet...</div>}
        </div>
    </div>
);
};

export default DebugPanel;
