import React from 'react';
import { categories, bgColors, textColors } from '../data/category_definitions';
import { BookOpen, Calculator, PieChart, Shapes, Sigma, BrainCircuit, BarChart3, ChevronRight, Lock } from 'lucide-react';

interface DashboardProps {
    onSelectCourse: (courseId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectCourse }) => {

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
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">Matematika</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Interaktív Tananyag</p>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Témakörök</h2>
                    <p className="text-slate-500 dark:text-slate-400">Válassz egy kategóriát a kezdéshez!</p>
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
            </main>
        </div>
    );
};

export default Dashboard;
