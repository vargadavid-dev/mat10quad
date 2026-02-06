import React from 'react';
import { TheoryBlockData } from '../types';
import Latex from './Latex';
import CoordinateSystem from './CoordinateSystem';

interface Props {
  data: TheoryBlockData;
  onComplete: () => void;
  isCompleted: boolean;
}

const TheoryBlock: React.FC<Props> = ({ data, onComplete, isCompleted }) => {

  // Helper to render inline elements: LaTeX, Bold, and Italic
  const renderInline = (text: string) => {
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        return <Latex key={index} block>{part.slice(2, -2)}</Latex>;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        return <Latex key={index}>{part.slice(1, -1)}</Latex>;
      }

      // Handle Bold (**text**)
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={index}>
          {boldParts.map((subPart, subIndex) => {
            if (subPart.startsWith('**') && subPart.endsWith('**')) {
              return <strong key={subIndex} className="font-bold text-slate-900">{subPart.slice(2, -2)}</strong>;
            }

            // Handle Italic (*text*) inside non-bold parts
            // We use [^*] to ensure we don't match empty ** or interfere with bold if something slipped through, though bold is already handled.
            const italicParts = subPart.split(/(\*[^*]+?\*)/g);
            return (
              <React.Fragment key={subIndex}>
                {italicParts.map((italicPart, iIndex) => {
                  if (italicPart.startsWith('*') && italicPart.endsWith('*') && italicPart.length > 2) {
                    return <em key={iIndex} className="italic text-slate-600 dark:text-slate-400">{italicPart.slice(1, -1)}</em>;
                  }
                  return italicPart;
                })}
              </React.Fragment>
            );
          })}
        </span>
      );
    });
  };

  // Helper to parse structure: Paragraphs and Lists
  const renderStructuredContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let listType: 'ol' | 'ul' | null = null;

    const flushList = () => {
      if (currentList.length > 0) {
        const ListTag = listType === 'ol' ? 'ol' : 'ul';
        const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc';
        // Added specific styling for list items
        elements.push(
          <ListTag key={`list-${elements.length}`} className={`${listClass} list-inside mb-4 space-y-2 pl-4 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700`}>
            {currentList}
          </ListTag>
        );
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList();
        return;
      }

      const isOrdered = /^\d+\.\s/.test(trimmed);
      const isUnordered = /^[-•]\s/.test(trimmed);

      if (isOrdered || isUnordered) {
        const currentType = isOrdered ? 'ol' : 'ul';

        if (listType && listType !== currentType) {
          flushList();
        }
        listType = currentType;

        const content = trimmed.replace(/^(\d+\.|[-•])\s/, '');
        currentList.push(<li key={`li-${i}`} className="pl-1 leading-relaxed">{renderInline(content)}</li>);
      } else {
        flushList();
        elements.push(<p key={`p-${i}`} className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{renderInline(trimmed)}</p>);
      }
    });

    flushList();
    return elements;
  };

  return (
    <div id={data.id} className={`scroll-mt-24 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border-l-4 ${isCompleted ? 'border-green-500 dark:border-green-400' : 'border-blue-500 dark:border-blue-400'} mb-6 transition-colors duration-300`}>
      <div className="p-6 sm:p-8">
        {data.title && (
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
            <span className="text-2xl">📚</span> {renderInline(data.title)}
          </h2>
        )}

        {data.layout === 'side-by-side' ? (
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 max-w-none">
              {renderStructuredContent(data.content)}
            </div>
            <div className="w-full md:w-2/5 flex justify-center shrink-0">
              {data.diagramConfig && data.diagramConfig.type === 'coordinate-system' ? (
                <CoordinateSystem
                  isInteractive={false}
                  width={300}
                  height={300}
                  range={5}
                  initialPoints={data.diagramConfig.points}
                  initialLines={data.diagramConfig.lines}
                  showGrid={true}
                  showLabels={true}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: data.illustration || '' }} className="w-full [&_text]:fill-slate-700 dark:[&_text]:fill-slate-300 [&_path]:stroke-slate-700 dark:[&_path]:stroke-slate-300" />
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Standard Layout: Content then Illustration */}
            <div className="max-w-none">
              {renderStructuredContent(data.content)}
            </div>

            {/* Illustration Area */}
            {(data.diagramConfig || data.illustration) && (
              <div className={`mt-8 flex justify-center ${data.diagramConfig ? '' : 'bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700'}`}>
                {data.diagramConfig && data.diagramConfig.type === 'coordinate-system' ? (
                  <CoordinateSystem
                    isInteractive={false}
                    width={300}
                    height={300}
                    range={5}
                    initialPoints={data.diagramConfig.points}
                    initialLines={data.diagramConfig.lines}
                    showGrid={true}
                    showLabels={true}
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: data.illustration || '' }} className="w-full max-w-md [&_text]:fill-slate-700 dark:[&_text]:fill-slate-300 [&_path]:stroke-slate-700 dark:[&_path]:stroke-slate-300" />
                )}
              </div>
            )}
          </>
        )}

        {!isCompleted && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={onComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
            >
              Értem, tovább!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheoryBlock;