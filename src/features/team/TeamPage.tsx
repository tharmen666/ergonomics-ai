import { GlassCard } from '../../components/ui/GlassCard';
import { User, Shield, Heart, Zap } from 'lucide-react';

const members = [
    {
        name: "Melly",
        role: "CEO & AI Safety Officer",
        desc: "Oversees all operations accurately. Never sleeps, never misses a hazard.",
        icon: Zap,
        color: "text-ohs-orange"
    },
    {
        name: "Marcus",
        role: "AI Risk Analyst",
        desc: "Specializes in data-driven risk prediction and compliance reporting.",
        icon: Shield,
        color: "text-blue-400"
    },
    {
        name: "Sarah",
        role: "AI Wellness Coordinator",
        desc: "Focuses on employee ergonomics, mental health, and hydration breaks.",
        icon: Heart,
        color: "text-pink-400"
    },
    {
        name: "Desigan Tharmen",
        role: "Chief Human Overseer",
        desc: "The visionary architect ensuring the AI team serves humanity perfectly.",
        icon: User,
        color: "text-green-400"
    },
];

export const TeamPage = () => {
    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold mb-4">Meet the Team</h2>
                <p className="text-gray-400">
                    A hybrid workforce of advanced AI agents and human leadership, working together for your safety.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {members.map((m) => (
                    <GlassCard key={m.name} className="text-center group hover:bg-white/10 transition-colors">
                        <div className={`w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                            <m.icon size={40} className={m.color} />
                        </div>
                        <h3 className="text-xl font-bold mb-1">{m.name}</h3>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${m.color}`}>{m.role}</p>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {m.desc}
                        </p>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};
