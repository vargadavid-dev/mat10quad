import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, AlertTriangle } from 'lucide-react';

interface MissionPanelProps {
    events: string[]; // Log of recent events
    activeObjective?: string;
}

const MissionPanel: React.FC<MissionPanelProps> = ({ events, activeObjective }) => {
    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute top-24 left-8 max-w-sm w-full z-40 space-y-4"
        >
            {/* Objective Card */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4 shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                    <Radio size={14} className="animate-pulse" /> Aktuális Küldetés
                </h3>
                <div className="text-white font-bold text-lg leading-tight">
                    {activeObjective || "Várd meg a parancsnok utasítását."}
                </div>

                {/* Scanner line effect */}
                <div className="absolute top-0 left-0 right-0 h-[100%] bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent -translate-y-[150%] animate-[scan_3s_ease-in-out_infinite] pointer-events-none"></div>
            </div>

            {/* Event Log */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                    <AlertTriangle size={14} /> Napló
                </h3>
                <div className="space-y-2 max-h-40 overflow-hidden font-mono text-sm relative">
                    <AnimatePresence>
                        {events.slice().reverse().slice(0, 4).map((event, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-slate-300 border-l border-slate-700 pl-2"
                            >
                                <span className="opacity-50 text-xs mr-2">{new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}</span>
                                {event}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Fade out bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none"></div>
                </div>
            </div>
        </motion.div>
    );
};

export default MissionPanel;
