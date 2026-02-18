import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gamepad2, Users, Crown, Zap } from 'lucide-react';
import GameHost from './GameHost';
import GameClient from './GameClient';

interface GameArenaProps {
    onBack: () => void;
}

const GameArena: React.FC<GameArenaProps> = ({ onBack }) => {
    const [view, setView] = useState<'intro' | 'host' | 'client'>(() => {
        const saved = sessionStorage.getItem('arena_view');
        return (saved === 'host' || saved === 'client') ? saved : 'intro';
    });

    useEffect(() => {
        sessionStorage.setItem('arena_view', view);
    }, [view]);

    const handleBack = () => {
        sessionStorage.removeItem('arena_view');
        onBack();
    };

    if (view === 'client') {
        return <GameClient onBack={() => setView('intro')} />;
    }

    if (view === 'host') {
        return <GameHost onBack={() => setView('intro')} />;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
            {/* Header */}
            <header className="fixed top-0 w-full z-10 p-4 border-b border-white/5 bg-slate-900/80 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Gamepad2 className="text-indigo-400" />
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                            Közös Aréna
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 pt-24 min-h-screen flex flex-col items-center justify-center">
                <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
                            Válassz <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Szerepet</span>
                        </h2>
                        <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                            Indíts új versenyt az osztálynak, vagy csatlakozz egy meglévőhöz a kód segítségével!
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
                        {/* Host Card */}
                        <button
                            onClick={() => setView('host')}
                            className="relative group overflow-hidden bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/50 p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20 text-left flex flex-col h-full"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Crown size={180} className="transform translate-x-12 -translate-y-12 rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:bg-indigo-500 transition-colors duration-300">
                                    <Crown size={32} className="text-indigo-400 group-hover:text-white" />
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">Játék Indítása</h3>
                                <p className="text-slate-400 group-hover:text-indigo-200 leading-relaxed">
                                    Tanárként vagy játékmesterként hozz létre egy új szobát. <br />
                                    <span className="text-sm mt-2 block opacity-70">Te választasz témakört és játékmódot.</span>
                                </p>
                            </div>
                        </button>

                        {/* Client Card */}
                        <button
                            onClick={() => setView('client')}
                            className="relative group overflow-hidden bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-purple-500/50 p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 text-left flex flex-col h-full"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Zap size={180} className="transform translate-x-12 -translate-y-12 -rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors duration-300">
                                    <Users size={32} className="text-purple-400 group-hover:text-white" />
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Csatlakozás</h3>
                                <p className="text-slate-400 group-hover:text-purple-200 leading-relaxed">
                                    Írd be a 4 jegyű kódot és csatlakozz a többiekhez. <br />
                                    <span className="text-sm mt-2 block opacity-70">Nincs regisztráció, csak egy becenév kell.</span>
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GameArena;
