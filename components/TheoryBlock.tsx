import React from 'react';
import { TheoryBlockData } from '../types';
import Latex from './Latex';
import CoordinateSystem from './CoordinateSystem';
import CircleAngleVisualizer from './geometry/CircleAngleVisualizer';
import CircleBasicsVisualizer from './geometry/CircleBasicsVisualizer';
import CircleLinesVisualizer from './geometry/CircleLinesVisualizer';
import CirclePartsVisualizer from './geometry/CirclePartsVisualizer';
import CircleFormulasVisualizer from './geometry/CircleFormulasVisualizer';
import ThalesVisualizer from './geometry/ThalesVisualizer';

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
              return <strong key={subIndex} className="font-bold text-slate-900 dark:text-slate-100">{subPart.slice(2, -2)}</strong>;
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

  // Helper to parse structure: Paragraphs, Lists, and Blockquotes
  const renderStructuredContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    let currentList: React.ReactNode[] = [];
    let listType: 'ol' | 'ul' | null = null;

    let currentBlockquote: string[] = [];
    let blockquoteType: 'normal' | 'important' | 'warning' = 'normal';

    const flushList = () => {
      if (currentList.length > 0) {
        const ListTag = listType === 'ol' ? 'ol' : 'ul';
        const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc';
        elements.push(
          <ListTag key={`list-${elements.length}`} className={`${listClass} list-inside mb-4 space-y-2 pl-4 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700`}>
            {currentList}
          </ListTag>
        );
        currentList = [];
        listType = null;
      }
    };

    const flushBlockquote = () => {
      if (currentBlockquote.length > 0) {
        const content = currentBlockquote.join(' ');
        if (blockquoteType === 'important') {
          elements.push(
            <div key={`alert-${elements.length}`} className="my-6 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500 text-indigo-900 dark:text-indigo-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2 font-bold text-indigo-700 dark:text-indigo-300 uppercase text-xs tracking-wider">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Fontos
              </div>
              <div className="text-base leading-relaxed">
                {renderInline(content)}
              </div>
            </div>
          );
        } else if (blockquoteType === 'warning') {
          elements.push(
            <div key={`alert-${elements.length}`} className="my-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 text-amber-900 dark:text-amber-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2 font-bold text-amber-700 dark:text-amber-300 uppercase text-xs tracking-wider">
                ⚠️ Figyelem
              </div>
              <div className="text-base leading-relaxed">
                {renderInline(content)}
              </div>
            </div>
          );
        } else {
          elements.push(
            <blockquote key={`quote-${elements.length}`} className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 py-2 my-4 text-slate-600 dark:text-slate-400 italic">
              {renderInline(content)}
            </blockquote>
          );
        }
        currentBlockquote = [];
        blockquoteType = 'normal';
      }
    };

    const flushAll = () => {
      flushList();
      flushBlockquote();
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushAll();
        return;
      }

      // Check for Blockquotes
      if (trimmed.startsWith('>')) {
        flushList(); // Close list if open
        let content = trimmed.substring(1).trim();

        // Check for Alert Types on the FIRST line of the block
        if (currentBlockquote.length === 0) {
          if (content.startsWith('[!IMPORTANT]')) {
            blockquoteType = 'important';
            return; // Skip reading this line as content, it's just a marker
          } else if (content.startsWith('[!WARNING]')) {
            blockquoteType = 'warning';
            return;
          }
        }
        currentBlockquote.push(content);
        return;
      } else {
        // If we encounter a non-quote line, flush any active blockquote
        flushBlockquote();
      }

      // Check for Interactive Component Tag
      if (trimmed.startsWith('<InteractiveComponent')) {
        flushAll();
        const typeMatch = trimmed.match(/type="([^"]+)"/);
        const type = typeMatch ? typeMatch[1] : null;

        if (type === 'CircleAngleVisualizer') {
          elements.push(<div key={`interactive-${i}`} className="my-6"><CircleAngleVisualizer /></div>);
        } else if (type === 'CircleBasicsVisualizer') {
          elements.push(<div key={`interactive-${i}`} className="my-6"><CircleBasicsVisualizer /></div>);
        } else if (type === 'CircleLinesVisualizer') {
          elements.push(<div key={`interactive-${i}`} className="my-6"><CircleLinesVisualizer /></div>);
        } else if (type === 'CirclePartsVisualizer') {
          elements.push(<div key={`interactive-${i}`} className="my-6"><CirclePartsVisualizer /></div>);
        } else if (type === 'CircleFormulasVisualizer') {
          elements.push(<div key={`interactive-${i}`} className="my-6"><CircleFormulasVisualizer /></div>);
        } else if (type === 'ThalesVisualizer') {
          elements.push(<div key={`interactive-${i}`} className="my-6"><ThalesVisualizer /></div>);
        }
        return;
      }

      // Check for Headers
      if (trimmed.startsWith('# ')) {
        flushAll();
        elements.push(<h3 key={`h1-${i}`} className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-6 mb-3 border-b-2 border-indigo-100 dark:border-indigo-900 pb-1 inline-block">{renderInline(trimmed.substring(2))}</h3>);
        return;
      }
      if (trimmed.startsWith('## ')) {
        flushAll();
        elements.push(<h4 key={`h2-${i}`} className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-5 mb-2">{renderInline(trimmed.substring(3))}</h4>);
        return;
      }
      if (trimmed.startsWith('### ')) {
        flushAll();
        elements.push(<h5 key={`h3-${i}`} className="text-base font-bold text-slate-700 dark:text-slate-300 mt-4 mb-2 uppercase tracking-wide">{renderInline(trimmed.substring(4))}</h5>);
        return;
      }

      const isOrdered = /^\d+\.\s/.test(trimmed);
      const isUnordered = /^[-•]\s/.test(trimmed);

      if (isOrdered || isUnordered) {
        // flushBlockquote is already handled by 'else' block above checking for '>'
        const currentType = isOrdered ? 'ol' : 'ul';

        if (listType && listType !== currentType) {
          flushList();
        }
        listType = currentType;

        const content = trimmed.replace(/^(\d+\.|[-•])\s/, '');
        currentList.push(<li key={`li-${i}`} className="pl-1 leading-relaxed">{renderInline(content)}</li>);
      } else {
        flushList();
        // flushBlockquote is already handled
        elements.push(<p key={`p-${i}`} className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{renderInline(trimmed)}</p>);
      }
    });

    flushAll();
    return elements;
  };

  const isExample = data.title?.toLowerCase().includes('példa') || data.title?.toLowerCase().includes('mintapélda');
  const isTheorem = data.title?.toLowerCase().includes('tétel');
  const isDefinition = data.title?.toLowerCase().includes('definíció') || data.title?.toLowerCase().includes('fogalom');

  let borderColor = 'border-blue-500 dark:border-blue-400';
  let badgeColor = 'bg-blue-500 dark:bg-blue-400';
  let badgeText = '📘 Elmélet';

  if (isCompleted) {
    borderColor = 'border-green-500 dark:border-green-400';
    badgeColor = 'bg-green-500 dark:bg-green-400';
  } else if (isExample) {
    borderColor = 'border-amber-500 dark:border-amber-400';
    badgeColor = 'bg-amber-500 dark:bg-amber-400';
    badgeText = '💡 Mintapélda';
  } else if (isTheorem) {
    borderColor = 'border-rose-500 dark:border-rose-400';
    badgeColor = 'bg-rose-500 dark:bg-rose-400';
    badgeText = '📜 Tétel';
  } else if (isDefinition) {
    borderColor = 'border-teal-500 dark:border-teal-400';
    badgeColor = 'bg-teal-500 dark:bg-teal-400';
    badgeText = '🔑 Definíció';
  }

  return (
    <div id={data.id} className={`relative scroll-mt-24 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border-t-4 ${borderColor} mb-6 transition-colors duration-300`}>

      {/* Type Badge */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${badgeColor} text-white text-xs font-bold px-4 py-1 rounded-b-xl uppercase tracking-wider shadow-sm`}>
        {badgeText}
      </div>

      <div className="p-6 sm:p-8 pt-12">
        {data.title && (
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
            {renderInline(data.title)}
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