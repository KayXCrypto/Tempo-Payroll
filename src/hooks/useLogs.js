import { useState } from 'react';

export function useLogs() {
    const [logs, setLogs] = useState([]);

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    };

    const clearLogs = () => setLogs([]);

    return { logs, addLog, clearLogs };
}