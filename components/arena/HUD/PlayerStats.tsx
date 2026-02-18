import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Target } from 'lucide-react';

interface PlayerStatsProps {
    team: string; // 'Piros', 'Kék'
    score: number;
    maxScore: number; // e.g., territory count
    isMyTurn: boolean;
    name: string;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ team, score, maxScore, isMyTurn, name }) => {
    const isRed = team === 'Piros';
    const color = isRed ? 'text-red-400' : 'text-blue-400';
    const bgGradient = isRed ? 'from-red-500/20 to-transparent' : 'from-blue-500/20 to-transparent';
    const border = isRed ? 'border-red-500/50' : 'border-blue-500/50';

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className={`
                absolute bottom-8 left-1/2 -translate-x-1/2 
                w-full max-w-3xl 
                bg-slate-900/80 backdrop-blur-md 
                border-t ${border} border-x border-slate-700/50
                rounded-t-3xl p-6 
                flex items-center justify-between
                shadow-[0_-10px_40px_rgba(0,0,0,0.5)]
                z-50
            `}
        >
            {/* Avatar / Identity */}
            <div className="flex items-center gap-4">
                <div className={`
                    w-16 h-16 rounded-full border-2 ${border} 
                    bg-gradient-to-br ${bgGradient}
                    flex items-center justify-center
                    relative
                    shadow-[0_0_20px_rgba(var(--team-color),0.4)]
                `}>
                    <Shield size={32} className={color} />
                    {isMyTurn && (
                        <motion.div
                            className={`absolute inset-0 rounded-full border-2 ${border}`}
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                    )}
                </div>
                <div>
                    <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Parancsnok</div>
                    <div className={`text-2xl font-black uppercase tracking-wider ${color} flex items-center gap-2`}>
                        {name}
                        {isMyTurn && <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded font-bold animate-pulse">AKTÍV</span>}
                    </div>
                </div>
            </div>

            {/* Stats / Resources */}
            <div className="flex gap-8">
                <div className="text-center">
                    <div className="text-xs uppercase text-slate-500 font-bold mb-1 flex items-center gap-1 justify-center">
                        <Target size={12} /> Terület
                    </div>
                    <div className="text-3xl font-mono font-bold text-white">
                        {score} <span className="text-sm text-slate-600">/ {maxScore}</span>
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-xs uppercase text-slate-500 font-bold mb-1 flex items-center gap-1 justify-center">
                        <Zap size={12} /> Energia
                    </div>
                    <div className="text-3xl font-mono font-bold text-yellow-400">
                        100%
                    </div>
                </div>
            </div>

            {/* Decorative Lines */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent ${isRed ? 'via-red-500' : 'via-blue-500'} to-transparent opacity-70`}></div>
        </motion.div>
    );
};

export default PlayerStats;
