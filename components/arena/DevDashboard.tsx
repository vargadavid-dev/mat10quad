import React, { useState } from 'react';
import { DIFFICULTY_CONFIG, DifficultyLevel, setDifficulty } from '../../utils/DifficultyConfig';
import { generateDuelQuestions } from '../../utils/QuestionGenerator';
import { X, ChevronDown, ChevronUp, Beaker, Settings2, ArrowLeft } from 'lucide-react';
import QuestionBlock from '../QuestionBlock';

// Human-readable names for subtypes
const SUBTYPE_LABELS: { [key: string]: { [key: string]: string } } = {
    'quadratic': {
        'coeffs': 'Együtthatók (a, b, c)',
        'vertex_x': 'Csúcs x-koordináta',
        'vertex_y': 'Csúcs y-koordináta',
        'num_roots': 'Megoldások száma',
        'discriminant': 'Diszkrimináns',
        'missing_param': 'Hiányzó paraméter',
        'roots': 'Gyökök kiszámítása',
        'vieta_sum': 'Gyökök összege (Viète)',
        'vieta_prod': 'Gyökök szorzata (Viète)',
        'inequality': 'Egyenlőtlenség',
    },
    'coord_geometry': {
        'read': 'Koordináta leolvasás',
        'plot': 'Pont ábrázolása',
    },
    'functions': {
        'mapping': 'Hozzárendelés típusa',
        'linear_int': 'Lineáris (egész)',
        'linear_frac': 'Lineáris (tört)',
    }
};

const TOPIC_LABELS: { [key: string]: string } = {
    'quadratic': '📐 Másodfokú egyenlet',
    'coord_geometry': '📍 Koordináta-geometria',
    'functions': '📈 Függvények',
};

const DIFFICULTY_COLORS: { [key: number]: string } = {
    1: 'bg-green-500/20 text-green-300 border-green-500/30',
    2: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    3: 'bg-red-500/20 text-red-300 border-red-500/30',
};

interface DevDashboardProps {
    onClose: () => void;
    onRegenerate: () => void;
    difficultyOverrides: { [topic: string]: { [subType: string]: DifficultyLevel } };
    onDifficultyChange: (topic: string, subType: string, level: DifficultyLevel) => void;
}

const DevDashboard: React.FC<DevDashboardProps> = ({ onClose, onRegenerate, difficultyOverrides, onDifficultyChange }) => {
    const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set(Object.keys(DIFFICULTY_CONFIG)));
    const [testQuestion, setTestQuestion] = useState<any>(null);

    const toggleTopic = (topic: string) => {
        setExpandedTopics(prev => {
            const next = new Set(prev);
            if (next.has(topic)) next.delete(topic);
            else next.add(topic);
            return next;
        });
    };

    const getDifficultyValue = (topic: string, subType: string): DifficultyLevel => {
        return difficultyOverrides[topic]?.[subType] ?? DIFFICULTY_CONFIG[topic]?.[subType] ?? 2;
    };

    const handleTest = (topic: string, subType: string) => {
        const questions = generateDuelQuestions([topic], 50);

        const suffixMap: { [key: string]: string } = {
            'coeffs': '-coeffs',
            'roots': '-root',
            'discriminant': '-disc',
            'num_roots': '-nroots',
            'vieta_sum': '-vsum',
            'vieta_prod': '-vprod',
            'inequality': '-ineq',
            'missing_param': '-param',
            'read': '',
            'plot': '',
            'mapping': '',
            'linear_int': '',
            'linear_frac': '',
        };

        const suffix = suffixMap[subType] || '';
        let match = null;

        if (suffix) {
            match = questions.find(q => q.id?.includes(suffix));
        } else {
            const inputTypeMap: { [key: string]: string } = {
                'read': 'key-value',
                'plot': 'coordinate-plot',
                'mapping': 'multiple-choice',
                'linear_int': 'coordinate-plot',
                'linear_frac': 'coordinate-plot',
            };
            const targetInput = inputTypeMap[subType];
            if (targetInput) {
                match = questions.find(q => q.inputType === targetInput);
            }
        }

        if (!match) match = questions[0];
        if (match) setTestQuestion(match);
    };

    return (
        <div className="absolute inset-0 z-[70] flex flex-col bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <Settings2 size={20} className="text-purple-400" />
                    <h2 className="text-lg font-bold text-white">Fejlesztői Felület</h2>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                    <X size={22} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                <p className="text-slate-500 text-xs mb-2">Feladattípusok és nehézségi szintek kezelése. Változások azonnal érvényesülnek.</p>

                {Object.entries(DIFFICULTY_CONFIG).map(([topic, subtypes]) => (
                    <div key={topic} className="bg-slate-900/60 rounded-xl border border-white/5 overflow-hidden">
                        {/* Topic Header */}
                        <button
                            onClick={() => toggleTopic(topic)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
                        >
                            <span className="font-bold text-sm text-slate-200">
                                {TOPIC_LABELS[topic] || topic}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500">{Object.keys(subtypes).length} típus</span>
                                {expandedTopics.has(topic) ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                            </div>
                        </button>

                        {/* Subtypes */}
                        {expandedTopics.has(topic) && (
                            <div className="border-t border-white/5">
                                {Object.keys(subtypes).map((subType) => {
                                    const currentDiff = getDifficultyValue(topic, subType);
                                    const label = SUBTYPE_LABELS[topic]?.[subType] || subType;

                                    return (
                                        <div key={subType} className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                                            {/* Name */}
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm text-slate-300 truncate block">{label}</span>
                                                <span className="text-[10px] text-slate-600 font-mono">{subType}</span>
                                            </div>

                                            {/* Difficulty Selector */}
                                            <div className="flex items-center gap-1.5 mx-3">
                                                {([1, 2, 3] as DifficultyLevel[]).map(level => (
                                                    <button
                                                        key={level}
                                                        onClick={() => onDifficultyChange(topic, subType, level)}
                                                        className={`w-7 h-7 rounded-md text-xs font-bold border transition-all ${currentDiff === level
                                                                ? DIFFICULTY_COLORS[level]
                                                                : 'bg-slate-800/50 text-slate-600 border-slate-700/30 hover:border-slate-600/50'
                                                            }`}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Test Button */}
                                            <button
                                                onClick={() => handleTest(topic, subType)}
                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-colors text-xs font-medium shrink-0"
                                            >
                                                <Beaker size={12} />
                                                Teszt
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/5 bg-slate-900/30 space-y-2">
                <button
                    onClick={onRegenerate}
                    className="w-full py-2 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors text-sm font-medium"
                >
                    🔄 Kérdések Újragenerálása (frissítés a pool-ban)
                </button>
                <p className="text-[10px] text-slate-600 text-center">
                    A módosítások csak az aktuális munkamenetben érvényesek.
                </p>
            </div>

            {/* Test Question Preview Overlay */}
            {testQuestion && (
                <div className="absolute inset-0 z-[80] flex flex-col bg-slate-950/97 backdrop-blur-lg animate-in fade-in duration-200">
                    {/* Preview Header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
                        <button
                            onClick={() => setTestQuestion(null)}
                            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                        >
                            <ArrowLeft size={18} />
                            <span className="text-sm font-medium">Vissza</span>
                        </button>
                        <div className="flex-1" />
                        <span className="text-xs text-slate-500">
                            Teszt előnézet — <span className="text-purple-400 font-mono">{testQuestion.inputType}</span>
                        </span>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <QuestionBlock
                            data={testQuestion}
                            onComplete={() => setTestQuestion(null)}
                            strictMode={false}
                            compact={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevDashboard;
