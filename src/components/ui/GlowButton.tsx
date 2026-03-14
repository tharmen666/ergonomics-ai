import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
}

export const GlowButton = ({ children, variant = 'primary', className = '', ...props }: GlowButtonProps) => {
    const variants = {
        primary: "bg-ohs-orange text-ohs-navy shadow-[0_4px_15px_-3px_rgba(249,168,37,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(249,168,37,0.5)]",
        secondary: "bg-ohs-blue/40 text-white border border-white/20 hover:bg-ohs-blue/60 backdrop-blur-md",
        danger: "bg-red-500/60 text-white shadow-[0_4px_15px_-3px_rgba(239,68,68,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(239,68,68,0.5)]",
    };

    return (
        <motion.button
            whileHover={{
                scale: 1.02,
                translateY: -2,
                filter: 'brightness(1.1)'
            }}
            whileTap={{ scale: 0.98, translateY: 0 }}
            className={`px-6 py-3 rounded-xl font-bold transition-all relative overflow-hidden group ${variants[variant]} ${className}`}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -inset-y-2 inset-x-0 w-2 bg-white/20 skew-x-[30deg] -translate-x-full group-hover:translate-x-[1200%] transition-transform duration-1000 ease-in-out" />
        </motion.button>
    );
};
