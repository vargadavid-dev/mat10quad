import React, { useState, useMemo } from 'react';
import { knowledgeBase, KnowledgeType } from '../../data/knowledge_base';
import { categories } from '../../data/category_definitions';
import KnowledgeCard from './KnowledgeCard';
import FlashcardView from './FlashcardView';
import { Search, ChevronLeft, Filter, Layers, Layers3, ChevronDown, ChevronUp } from 'lucide-react';

interface KnowledgeBaseProps {
    onBack: () => void;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<KnowledgeType | 'all'>('all');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'list' | 'flashcard'>('list');
    const [showCategories, setShowCategories] = useState(false);

    const filteredItems = useMemo(() => {
        return knowledgeBase.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesType = activeFilter === 'all' || item.type === activeFilter;
            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

            return matchesSearch && matchesType && matchesCategory;
        });
    }, [searchTerm, activeFilter, activeCategory]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 md:sticky top-0 z-30 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-3 mb-3">
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                            Tudástár
                        </h1>
                        <button
                            onClick={() => setViewMode(viewMode === 'list' ? 'flashcard' : 'list')}
                            className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'flashcard'
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                        >
                            <Layers3 size={16} />
                            <span className="hidden sm:inline">{viewMode === 'flashcard' ? 'Lista nézet' : 'Flashcard'}</span>
                        </button>
                    </div>

                    {/* Search + Type Filters in one row on mobile */}
                    <div className="flex gap-2 items-center">
                        <div className="relative flex-1 min-w-0">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Keresés..."
                                className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 border-transparent focus:bg-white dark:focus:bg-slate-900 border focus:border-indigo-500 rounded-lg outline-none transition-all dark:text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-1 overflow-x-auto no-scrollbar shrink-0">
                            {(['all', 'definition', 'theorem', 'formula'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setActiveFilter(type)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeFilter === type
                                        ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900'
                                        : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                                        }`}
                                >
                                    {type === 'all' && 'Összes'}
                                    {type === 'definition' && 'Fogalom'}
                                    {type === 'theorem' && 'Tétel'}
                                    {type === 'formula' && 'Képlet'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Filters - collapsible on mobile */}
                    <div className="mt-2">
                        <button
                            onClick={() => setShowCategories(!showCategories)}
                            className="md:hidden flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-1"
                        >
                            <Filter size={12} />
                            Témakör szűrés{activeCategory !== 'all' ? ' (aktív)' : ''}
                            {showCategories ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                        <div className={`flex-wrap gap-1.5 border-t border-slate-100 dark:border-slate-700 pt-2 ${showCategories ? 'flex' : 'hidden md:flex'}`}>
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${activeCategory === 'all'
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <Layers size={12} />
                                Minden
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === cat.id
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {cat.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 py-6">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                            Nincs találat
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            Próbálj meg más keresőszót vagy változtass a szűrőkön.
                        </p>
                    </div>
                ) : viewMode === 'flashcard' ? (
                    <FlashcardView
                        items={filteredItems}
                        onClose={() => setViewMode('list')}
                    />
                ) : (
                    <div className="columns-1 md:columns-2 gap-4 space-y-4">
                        {filteredItems.map(item => (
                            <div key={item.id} className="break-inside-avoid mb-4">
                                <KnowledgeCard item={item} />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default KnowledgeBase;
