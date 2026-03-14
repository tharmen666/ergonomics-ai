import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const GlassCard = ({ children, className, hoverEffect = true }: GlassCardProps) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { scale: 1.02, boxShadow: "0 0 20px rgba(0, 61, 92, 0.5)" } : {}}
            className={cn(
                "backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl",
                "relative overflow-hidden",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};
