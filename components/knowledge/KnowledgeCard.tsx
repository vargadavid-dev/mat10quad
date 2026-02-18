import React, { useState } from 'react';
import { KnowledgeItem } from '../../data/knowledge_base';
import { categories } from '../../data/category_definitions';

import { ChevronDown, ChevronUp, Book, FileText, Sigma, Info, Hash, Link as LinkIcon, Lightbulb } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface KnowledgeCardProps {
    item: KnowledgeItem;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ item }) => {
    const [isProofExpanded, setIsProofExpanded] = useState(false);

    const getIcon = () => {
        switch (item.type) {
            case 'definition': return <Book size={18} className="text-blue-500" />;
            case 'theorem': return <FileText size={18} className="text-purple-500" />;
            case 'formula': return <Sigma size={18} className="text-green-500" />;
        }
    };

    const getTypeLabel = () => {
        switch (item.type) {
            case 'definition': return 'Definíció';
            case 'theorem': return 'Tétel';
            case 'formula': return 'Képlet';
        }
    };

    const getBorderClass = () => {
        switch (item.type) {
            case 'definition': return 'border-l-4 border-l-blue-500';
            case 'theorem': return 'border-l-4 border-l-purple-500';
            case 'formula': return 'border-l-4 border-l-green-500';
            default: return '';
        }
    }

    const getCategoryTitle = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.title : categoryId;
    };

    // Helper to render text mixed with LaTeX
    const renderContent = (text: string) => {
        if (!text) return null;
        const parts = text.split(/(\$[^$]+\$)/g);
        return parts.map((part, idx) => {
            if (part.startsWith('$') && part.endsWith('$')) {
                return <InlineMath key={idx} math={part.slice(1, -1)} />;
            }
            return <span key={idx}>{part}</span>;
        });
    };

    return (
        <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow ${getBorderClass()}`}>
            <div className="p-5">
                {/* Check spelling/grammar context if needed, but primarily Math */}

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        {getIcon()}
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {getTypeLabel()}
                        </span>
                    </div>
                    {item.category && (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium">
                            {getCategoryTitle(item.category)}
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {item.title}
                </h3>

                {/* Main Content (Definition/Statement) */}
                <div className="mb-4 text-slate-800 dark:text-slate-100 font-medium text-lg leading-relaxed">
                    {renderContent(item.content)}
                </div>

                {/* Additional Sections */}
                <div className="space-y-3">
                    {/* Notation */}
                    {item.notation && (
                        <div className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <Hash size={16} className="shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold block text-xs uppercase tracking-wider mb-1">Jelölés</span>
                                {renderContent(item.notation)}
                            </div>
                        </div>
                    )}

                    {/* Description/Explanation */}
                    {item.description && (
                        <div className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                            <Info size={16} className="shrink-0 mt-0.5 text-slate-400" />
                            <div>{renderContent(item.description)}</div>
                        </div>
                    )}

                    {/* Example */}
                    {item.example && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800/30 text-sm">
                            <div className="flex items-center gap-2 mb-1 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
                                <Lightbulb size={14} /> Példa
                            </div>
                            <div className="text-indigo-900 dark:text-indigo-200">
                                {renderContent(item.example)}
                            </div>
                        </div>
                    )}

                    {/* Proof (Expandable) */}
                    {item.proof && (
                        <div className="pt-2">
                            <button
                                onClick={() => setIsProofExpanded(!isProofExpanded)}
                                className="flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors"
                            >
                                {isProofExpanded ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                                Bizonyítás megtekintése
                            </button>

                            {isProofExpanded && (
                                <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-sm text-slate-700 dark:text-slate-300 italic border-l-4 border-l-purple-300 dark:border-l-purple-700 animate-in slide-in-from-top-2">
                                    {renderContent(item.proof)}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Tags */}
                <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                    {item.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
                            #{tag}
                        </span>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default KnowledgeCard;
