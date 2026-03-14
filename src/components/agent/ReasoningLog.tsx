import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Terminal, Cpu } from 'lucide-react';
import { useAgentLog } from '../../store/agentLogStore';

export const ReasoningLog = () => {
    const { logs, addLog } = useAgentLog();

    // Background random chatter
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // Only log occasionally to avoiding spamming interaction logs
                const messages = [
                    { agent: 'Marcus', message: 'Indexing risk factors...' },
                    { agent: 'Sarah', message: 'Calibrating wellness algorithms...' },
                    { agent: 'System', message: 'Heartbeat: Stable.' },
                    { agent: 'Finance', message: 'Checking ledger integration...' }
                ];
                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                addLog(randomMsg.agent as any, randomMsg.message);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [addLog]);

    return (
        <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden font-mono text-xs w-full max-w-md shadow-2xl">
            <div className="bg-white/5 p-2 px-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-ohs-orange">
                    <Terminal size={12} />
                    <span className="font-bold tracking-wider uppercase">Agent Reasoning Log</span>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1 text-ohs-green">
                        <Cpu size={10} />
                        <span>LIVE</span>
                    </div>
                </div>
            </div>
            <div className="p-3 space-y-2 h-40 flex flex-col-reverse relative scroll-smooth">
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0 }}
                            className="flex gap-2 text-gray-300 items-start"
                        >
                            <span className="text-gray-600 shrink-0 text-[10px] mt-0.5">[{log.timestamp}]</span>
                            <span className={`font-bold shrink-0 ${log.agent === 'Melly' ? 'text-ohs-orange' :
                                    log.agent === 'Marcus' ? 'text-blue-400' :
                                        log.agent === 'Sarah' ? 'text-pink-400' :
                                            log.agent === 'Finance' ? 'text-yellow-400' :
                                                'text-green-500'
                                }`}>
                                {log.agent}:
                            </span>
                            <span className="break-words leading-tight">{log.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {/* Scanline effect */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10px] w-full animate-scan" />
            </div>
        </div>
    );
};
