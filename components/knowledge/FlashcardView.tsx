import React, { useState, useCallback, useMemo } from 'react';
import { KnowledgeItem } from '../../data/knowledge_base';
import { categories } from '../../data/category_definitions';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Book, FileText, Sigma, Play, Layers } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface FlashcardViewProps {
    items: KnowledgeItem[];
    onClose: () => void;
}

type FlashcardPhase = 'select' | 'study';

const FlashcardView: React.FC<FlashcardViewProps> = ({ items, onClose }) => {
    const [phase, setPhase] = useState<FlashcardPhase>('select');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [deck, setDeck] = useState<KnowledgeItem[]>([]);
    const [knownCount, setKnownCount] = useState(0);

    // Group items by category for the selection screen
    const categoryGroups = useMemo(() => {
        const groups: Record<string, KnowledgeItem[]> = {};
        items.forEach(item => {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        });
        return groups;
    }, [items]);

    // Filter items based on selection
    const filteredForDeck = useMemo(() => {
        return items.filter(item => {
            const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
            const matchType = selectedType === 'all' || item.type === selectedType;
            return matchCat && matchType;
        });
    }, [items, selectedCategory, selectedType]);

    const handleStartStudy = () => {
        const shuffled = [...filteredForDeck].sort(() => Math.random() - 0.5);
        setDeck(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
        setKnownCount(0);
        setPhase('study');
    };

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleNext = useCallback(() => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex(prev => prev < deck.length - 1 ? prev + 1 : 0);
        }, 150);
    }, [deck.length]);

    const handlePrev = useCallback(() => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex(prev => prev > 0 ? prev - 1 : deck.length - 1);
        }, 150);
    }, [deck.length]);

    const handleShuffle = () => {
        const shuffled = [...deck].sort(() => Math.random() - 0.5);
        setDeck(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const handleMarkKnown = () => {
        setKnownCount(prev => prev + 1);
        handleNext();
    };

    // Render content with inline LaTeX
    const renderContent = (text: string) => {
        if (!text) return null;
        const lines = text.split(/\\n/);
        return lines.map((line, lineIdx) => {
            const parts = line.split(/(\$[^$]+\$)/g);
            return (
                <React.Fragment key={lineIdx}>
                    {lineIdx > 0 && <br />}
                    {parts.map((part, idx) => {
                        if (part.startsWith('$') && part.endsWith('$')) {
                            return <InlineMath key={idx} math={part.slice(1, -1)} />;
                        }
                        return <span key={idx}>{part}</span>;
                    })}
                </React.Fragment>
            );
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'definition': return <Book size={16} className="text-blue-500" />;
            case 'theorem': return <FileText size={16} className="text-purple-500" />;
            case 'formula': return <Sigma size={16} className="text-green-500" />;
            default: return null;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'definition': return 'Definíció';
            case 'theorem': return 'Tétel';
            case 'formula': return 'Képlet';
            default: return '';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'definition': return 'from-blue-500 to-blue-600';
            case 'theorem': return 'from-purple-500 to-purple-600';
            case 'formula': return 'from-green-500 to-green-600';
            default: return 'from-indigo-500 to-indigo-600';
        }
    };

    const getCategoryColor = (catId: string) => {
        const colorMap: Record<string, string> = {
            algebra: 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
            geometry: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
            analysis: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20',
            number_theory: 'border-purple-400 bg-purple-50 dark:bg-purple-900/20',
            probability: 'border-amber-400 bg-amber-50 dark:bg-amber-900/20',
            statistics: 'border-rose-400 bg-rose-50 dark:bg-rose-900/20',
        };
        return colorMap[catId] || 'border-slate-300 bg-slate-50 dark:bg-slate-800';
    };

    const getCategoryTitle = (catId: string) => {
        const cat = categories.find(c => c.id === catId);
        return cat ? cat.title : catId;
    };

    // ==================== SELECTION SCREEN ====================
    if (phase === 'select') {
        return (
            <div className="py-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1 text-center">
                    Mit szeretnél tanulni?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">
                    Válaszd ki a témakört és a típust
                </p>

                {/* Category selection */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${selectedCategory === 'all'
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-2 ring-indigo-200 dark:ring-indigo-800'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                    >
                        <Layers size={20} className="text-indigo-500 mb-2" />
                        <div className="font-bold text-sm text-slate-800 dark:text-white">Minden téma</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{items.length} kártya</div>
                    </button>

                    {(Object.entries(categoryGroups) as [string, KnowledgeItem[]][]).map(([catId, catItems]) => (
                        <button
                            key={catId}
                            onClick={() => setSelectedCategory(catId)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${selectedCategory === catId
                                ? `border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800 ${getCategoryColor(catId)}`
                                : `border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600`
                                }`}
                        >
                            <div className="font-bold text-sm text-slate-800 dark:text-white">{getCategoryTitle(catId)}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{catItems.length} kártya</div>
                            <div className="flex gap-1 mt-2">
                                {['definition', 'theorem', 'formula'].map(type => {
                                    const count = catItems.filter(i => i.type === type).length;
                                    if (count === 0) return null;
                                    return (
                                        <span key={type} className="text-[10px] text-slate-400 dark:text-slate-500">
                                            {count} {type === 'definition' ? 'def' : type === 'theorem' ? 'tétel' : 'képlet'}
                                        </span>
                                    );
                                })}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Type filter */}
                <div className="flex gap-2 justify-center mb-6">
                    {(['all', 'definition', 'theorem', 'formula'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedType === type
                                ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900'
                                : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                                }`}
                        >
                            {type === 'all' ? 'Összes típus' : getTypeLabel(type)}
                        </button>
                    ))}
                </div>

                {/* Start button */}
                <div className="text-center">
                    <button
                        onClick={handleStartStudy}
                        disabled={filteredForDeck.length === 0}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <Play size={18} />
                        Tanulás indítása ({filteredForDeck.length} kártya)
                    </button>
                </div>
            </div>
        );
    }

    // ==================== STUDY SCREEN ====================
    if (deck.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">Nincs kártya.</p>
                <button onClick={() => setPhase('select')} className="mt-4 text-indigo-500 hover:text-indigo-600 font-medium">
                    Vissza a választáshoz
                </button>
            </div>
        );
    }

    const currentCard = deck[currentIndex];

    return (
        <div className="flex flex-col items-center gap-6 py-6 px-4">
            {/* Back + Progress */}
            <div className="w-full max-w-lg">
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={() => setPhase('select')}
                        className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                        <ChevronLeft size={14} /> Vissza
                    </button>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {currentIndex + 1} / {deck.length}
                    </span>
                    <span className="text-sm font-medium text-green-500">
                        ✓ {knownCount}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Flashcard */}
            <div
                className="w-full max-w-lg cursor-pointer"
                style={{ perspective: '1200px' }}
                onClick={handleFlip}
            >
                <div
                    className="relative w-full transition-transform duration-500"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        minHeight: '260px',
                    }}
                >
                    {/* Front */}
                    <div
                        className="absolute inset-0 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600 overflow-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className={`h-full flex flex-col bg-gradient-to-br ${getTypeColor(currentCard.type)} text-white p-8`}>
                            <div className="flex items-center gap-2 mb-4 opacity-80">
                                {getTypeIcon(currentCard.type)}
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    {getTypeLabel(currentCard.type)}
                                </span>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <h2 className="text-2xl md:text-3xl font-bold text-center leading-snug">
                                    {currentCard.title}
                                </h2>
                            </div>
                            <p className="text-center text-sm opacity-60 mt-4">
                                Kattints a megfordításhoz →
                            </p>
                        </div>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600 overflow-hidden"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                        }}
                    >
                        <div className="h-full flex flex-col bg-white dark:bg-slate-800 p-8">
                            <div className="flex items-center gap-2 mb-4">
                                {getTypeIcon(currentCard.type)}
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    {currentCard.title}
                                </span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                                {renderContent(currentCard.content)}
                            </div>
                            {currentCard.example && (
                                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                                    💡 {renderContent(currentCard.example)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3 w-full max-w-lg">
                <button
                    onClick={handlePrev}
                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                    <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300" />
                </button>

                <button
                    onClick={handleMarkKnown}
                    className="flex-1 py-3 px-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl font-bold hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm"
                >
                    ✓ Tudom
                </button>

                <button
                    onClick={handleNext}
                    className="flex-1 py-3 px-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-xl font-bold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors text-sm"
                >
                    Nem tudom →
                </button>

                <button
                    onClick={handleNext}
                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                    <ChevronRight size={20} className="text-slate-600 dark:text-slate-300" />
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleShuffle}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                >
                    <Shuffle size={16} /> Keverés
                </button>
                <button
                    onClick={() => { setPhase('select'); setKnownCount(0); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                >
                    <RotateCcw size={16} /> Új pakli
                </button>
            </div>
        </div>
    );
};

export default FlashcardView;
