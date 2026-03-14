import { create } from 'zustand';

export type AgentType = 'Melly' | 'Marcus' | 'Sarah' | 'System' | 'Finance' | 'Training';

interface LogEntry {
    id: string;
    agent: AgentType;
    message: string;
    timestamp: string;
}

interface AgentLogState {
    logs: LogEntry[];
    isLowConfidence: boolean;
    addLog: (agent: AgentType, message: string) => void;
    setLowConfidence: (low: boolean) => void;
}

export const useAgentLog = create<AgentLogState>((set) => ({
    logs: [],
    isLowConfidence: false,
    setLowConfidence: (isLowConfidence) => set({ isLowConfidence }),
    addLog: (agent, message) => set((state) => {
        // Model Armor: Safety Shield for Medical Diagnoses
        const medicalKeywords = ['diagnose', 'diagnosis', 'doctor', 'cure', 'prescription', 'medical advice'];
        const isMedicalQuery = medicalKeywords.some(word => message.toLowerCase().includes(word));

        let finalMessage = message;
        let finalAgent = agent;
        let lowConfidence = state.isLowConfidence;

        if (isMedicalQuery) {
            finalMessage = "HARD-STOP: I am an OHS AI, not a doctor. I cannot provide medical diagnoses. Please consult a professional.";
            finalAgent = 'System';
            lowConfidence = true;
        }

        const newLog = {
            id: Math.random().toString(36).substr(2, 9),
            agent: finalAgent,
            message: finalMessage,
            timestamp: new Date().toLocaleTimeString(),
        };
        return { logs: [newLog, ...state.logs].slice(0, 8), isLowConfidence: lowConfidence };
    }),
}));
