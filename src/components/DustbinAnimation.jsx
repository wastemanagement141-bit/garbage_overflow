import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const DustbinAnimation = ({ fillPercentage }) => {
    const [level, setLevel] = useState(0);
    const controls = useAnimation();

    useEffect(() => {
        const pct = isNaN(fillPercentage) ? 0 : fillPercentage;
        setLevel(Math.min(Math.max(pct, 0), 100));
    }, [fillPercentage]);

    // Determine color based on fill level
    const getColor = (pct) => {
        if (pct >= 80) return '#e11d48'; // bg-rose-600
        if (pct >= 50) return '#f59e0b'; // bg-amber-500
        return '#10b981'; // bg-emerald-500
    };

    const color = getColor(level);

    return (
        <div className="flex justify-center items-center py-4">
            <div className="relative w-32 h-44">
                {/* Bin Lid - Animated to open slightly when full */}
                <motion.div
                    animate={{
                        rotate: level > 80 ? -15 : 0,
                        y: level > 80 ? -10 : 0
                    }}
                    transition={{ type: "spring", stiffness: 100 }}
                    style={{ originX: 0.8, originY: 1 }}
                    className="absolute -top-4 left-0 w-full z-20"
                >
                    <svg viewBox="0 0 100 20" className="w-full drop-shadow-md">
                        <path d="M10 20 L5 15 L20 5 L80 5 L95 15 L90 20 Z" fill="#334155" />
                        <rect x="40" y="0" width="20" height="5" rx="2" fill="#334155" />
                    </svg>
                </motion.div>

                {/* Can Container */}
                <div className="relative w-full h-full overflow-hidden rounded-b-xl border-4 border-slate-700 bg-white shadow-xl">
                    {/* Background Mesh/Pattern */}
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:8px_8px]"></div>

                    {/* Liquid Fill */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 w-full"
                        animate={{ height: `${level}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    >
                        <div
                            className="w-full h-full opacity-80"
                            style={{ backgroundColor: color }}
                        >
                            {/* Bubbles/Trash particles */}
                            <motion.div
                                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full opacity-30"
                            />
                            <motion.div
                                animate={{ y: [0, -15, 0], x: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 4, delay: 1, ease: "easeInOut" }}
                                className="absolute top-1/2 right-1/4 w-2 h-2 bg-white rounded-full opacity-30"
                            />
                        </div>

                        {/* Wave effect at the top of the liquid */}
                        <motion.div
                            className="absolute -top-3 left-0 right-0 h-6 w-[200%]"
                            style={{ backgroundColor: color, opacity: 0.8, borderRadius: '40%' }}
                            animate={{ x: ["-25%", "0%"] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        />
                    </motion.div>

                    {/* Glass reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-b-lg"></div>
                </div>

                {/* Percentage Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <motion.span
                        key={level}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-3xl font-black drop-shadow-lg ${level > 50 ? 'text-white' : 'text-slate-700'}`}
                    >
                        {Math.round(level)}%
                    </motion.span>
                </div>
            </div>
        </div>
    );
};

export default DustbinAnimation;
