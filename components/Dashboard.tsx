import React from 'react';
import { categories, bgColors, textColors } from '../data/category_definitions';
import { BookOpen, Calculator, PieChart, Shapes, Sigma, BrainCircuit, BarChart3, ChevronRight, Lock, Gamepad2, Users, Rocket, Sun, Moon, ShieldCheck } from 'lucide-react';

interface DashboardProps {
    onSelectCourse: (courseId: string) => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectCourse, isDarkMode, onToggleTheme }) => {

    const getIcon = (id: string) => {
        switch (id) {
            case 'algebra': return <Calculator size={24} />;
            case 'geometry': return <Shapes size={24} />;
            case 'analysis': return <Sigma size={24} />;
            case 'thinking_methods': return <BrainCircuit size={24} />;
            case 'statistics': return <BarChart3 size={24} />;
            case 'probability': return <PieChart size={24} />;
            default: return <BookOpen size={24} />;
        }
    };

    const getColorClass = (id: string, type: 'bg' | 'text') => {
        const key = id as keyof typeof bgColors;
        if (type === 'bg') return bgColors[key] || bgColors.default;
        return textColors[key] || textColors.default;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300">
            <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 transition-colors">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-110 transition-transform duration-300">
                            <Rocket size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-tight flex items-center gap-2">
                                Matekverzum <span className="text-xs font-normal text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">BÉTA</span>
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-300 font-medium">Lépésről lépésre a csillagokig</p>
                        </div>
                    </div>
                    <button
                        onClick={onToggleTheme}
                        className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title={isDarkMode ? "Világos mód" : "Sötét mód"}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Témakörök</h2>
                    <p className="text-slate-500 dark:text-slate-400">Válassz egy kategóriát a kezdéshez!</p>
                </div>

                {/* Main Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* Arena Card */}
                    <div
                        onClick={() => alert("A Közös Aréna jelenleg fejlesztés alatt áll. Hamarosan érkezik!")}
                        className="bg-slate-200 dark:bg-slate-800 rounded-2xl p-6 text-slate-500 dark:text-slate-400 shadow-sm cursor-not-allowed relative overflow-hidden group grayscale"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-10 -translate-y-10">
                            <Gamepad2 size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-slate-300 dark:bg-slate-700 rounded-lg">
                                    <Users size={24} className="text-slate-500 dark:text-slate-400" />
                                </div>
                                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Multiplayer</span>
                                <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
                                    Fejlesztés alatt
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-slate-600 dark:text-slate-300">Közös Aréna</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                Hívd ki az osztálytársaidat egy valós idejű versenyre!
                            </p>
                            <button disabled className="bg-slate-300 dark:bg-slate-700 text-slate-500 border border-slate-300 dark:border-slate-600 px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2 text-sm cursor-not-allowed">
                                Hamarosan... <Lock size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Knowledge Base Card */}
                    <div
                        onClick={() => onSelectCourse('KNOWLEDGE_BASE')}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-200 dark:shadow-none cursor-pointer transform transition-all hover:scale-[1.01] hover:shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500">
                            <BookOpen size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <BookOpen size={24} className="text-white" />
                                </div>
                                <span className="font-bold text-emerald-100 uppercase tracking-wider text-xs">Tudástár</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Fogalmak & Tételek</h2>
                            <p className="text-emerald-100 text-sm mb-4">
                                Definíciók, bizonyítások és képletek egy helyen.
                            </p>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-lg font-bold transition-all inline-flex items-center gap-2 text-sm">
                                Megnyitás <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all overflow-hidden group"
                        >
                            <div className={`p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 ${getColorClass(category.id, 'bg')}`}>
                                <div className={`${getColorClass(category.id, 'text')}`}>
                                    {getIcon(category.id)}
                                </div>
                                <h3 className={`font-bold text-lg ${getColorClass(category.id, 'text')}`}>
                                    {category.title}
                                </h3>
                            </div>

                            <div className="p-2">
                                {category.subcategories.map((sub, idx) => (
                                    <button
                                        key={sub.id}
                                        onClick={() => sub.isAvailable && onSelectCourse(sub.id)}
                                        className={`w-full text-left p-3 rounded-lg flex items-center justify-between group/btn transition-colors ${sub.isAvailable
                                            ? 'hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer'
                                            : 'opacity-50 cursor-not-allowed'
                                            }`}
                                    >
                                        <span className={`font-medium ${sub.isAvailable ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                                            {sub.title}
                                        </span>
                                        {sub.isAvailable ? (
                                            <ChevronRight size={16} className="text-slate-300 group-hover/btn:text-indigo-500 transition-colors" />
                                        ) : (
                                            <Lock size={14} className="text-slate-300" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main >

            <footer className="py-6 text-center text-slate-400 text-sm mt-auto border-t border-slate-200 dark:border-slate-800">
                <p>
                    &copy; {new Date().getFullYear()} <span className="font-bold text-slate-500 dark:text-slate-400">Matekverzum</span>
                </p>
                <p className="mt-1 flex items-center justify-center gap-1">
                    Készítette: <span className="text-indigo-500 font-medium">Varga Dávid</span>
                    <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded ml-1">v1.0</span>
                </p>
                <button
                    onClick={() => onSelectCourse('VERIFY_CERTIFICATE')}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                >
                    <ShieldCheck size={14} />
                    Oklevél ellenőrzés
                </button>
            </footer>
        </div >
    );
};

export default Dashboard;
