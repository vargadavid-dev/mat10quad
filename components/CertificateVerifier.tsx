import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle, XCircle } from 'lucide-react';

interface DecodedCertificate {
    studentName: string;
    courseName: string;
    scorePercentage: number;
    completionDate: string;
}

const CertificateVerifier: React.FC = () => {
    const [code, setCode] = useState('');
    const [result, setResult] = useState<DecodedCertificate | null>(null);
    const [error, setError] = useState(false);

    const handleVerify = () => {
        setError(false);
        setResult(null);

        try {
            const decoded = decodeURIComponent(escape(atob(code.trim())));
            const parts = decoded.split('|');

            if (parts.length !== 4) {
                setError(true);
                return;
            }

            const [studentName, courseName, scoreStr, completionDate] = parts;
            const scorePercentage = parseInt(scoreStr, 10);

            if (isNaN(scorePercentage) || !studentName || !courseName || !completionDate) {
                setError(true);
                return;
            }

            setResult({ studentName, courseName, scorePercentage, completionDate });
        } catch {
            setError(true);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                        <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            Oklevél Ellenőrzés
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Írd be a hitelesítési kódot az oklevélről
                        </p>
                    </div>
                </div>

                {/* Input */}
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            setError(false);
                            setResult(null);
                        }}
                        placeholder="Hitelesítési kód beillesztése..."
                        className="flex-1 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all font-mono text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    />
                    <button
                        onClick={handleVerify}
                        disabled={!code.trim()}
                        className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
                    >
                        <Search size={18} />
                        Ellenőrzés
                    </button>
                </div>

                {/* Result */}
                {result && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6 animate-fade-in">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="text-green-600" size={22} />
                            <span className="font-bold text-green-700 dark:text-green-300 text-lg">
                                Érvényes oklevél!
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-700/50">
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Tanuló neve</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100">{result.studentName}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-700/50">
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Fejezet</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100">{result.courseName}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-700/50">
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Eredmény</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{result.scorePercentage}%</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Dátum</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100">{result.completionDate}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6 animate-fade-in">
                        <div className="flex items-center gap-2">
                            <XCircle className="text-red-500" size={22} />
                            <span className="font-bold text-red-700 dark:text-red-300">
                                Érvénytelen kód!
                            </span>
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                            A megadott kód nem felismerhető. Ellenőrizd, hogy pontosan másoltad-e be.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CertificateVerifier;
