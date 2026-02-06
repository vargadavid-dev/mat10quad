import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav>
            <div className="max-w-3xl mx-auto px-4 py-2">
                <ol className="flex items-center gap-1 text-sm flex-wrap">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;

                        return (
                            <li key={index} className="flex items-center gap-1">
                                {index === 0 && (
                                    <Home size={14} className="text-slate-400 dark:text-slate-500 mr-1" />
                                )}

                                {isLast ? (
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                                        {item.label}
                                    </span>
                                ) : (
                                    <>
                                        <button
                                            onClick={item.onClick}
                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors"
                                        >
                                            {item.label}
                                        </button>
                                        <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
};

export default Breadcrumb;
