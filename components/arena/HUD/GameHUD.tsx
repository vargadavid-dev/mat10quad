import React from 'react';
import { cn } from '../../../lib/utils';

interface GameHUDProps {
    children: React.ReactNode;
    className?: string;
}

const GameHUD: React.FC<GameHUDProps> = ({ children, className }) => {
    return (
        <div className={cn("relative h-screen w-full overflow-hidden flex flex-col", className)}>
            {/* Top Bar Decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 z-50"></div>
            <div className="absolute top-1 left-0 right-0 h-12 bg-gradient-to-b from-slate-900/80 to-transparent pointer-events-none z-40"></div>

            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-32 h-32 border-l-2 border-t-2 border-cyan-500/30 rounded-tl-3xl pointer-events-none z-40"></div>
            <div className="absolute top-4 right-4 w-32 h-32 border-r-2 border-t-2 border-purple-500/30 rounded-tr-3xl pointer-events-none z-40"></div>
            <div className="absolute bottom-4 left-4 w-32 h-32 border-l-2 border-b-2 border-cyan-500/30 rounded-bl-3xl pointer-events-none z-40"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 border-r-2 border-b-2 border-purple-500/30 rounded-br-3xl pointer-events-none z-40"></div>

            {children}
        </div>
    );
};

export default GameHUD;
