import React from 'react';
import { TheoryBlockData } from '../types';
import Latex from './Latex';

interface Props {
  data: TheoryBlockData;
  onComplete: () => void;
  isCompleted: boolean;
}

const TheoryBlock: React.FC<Props> = ({ data, onComplete, isCompleted }) => {
  
  // Helper to render inline elements: LaTeX and Bold
  const renderInline = (text: string) => {
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        return <Latex key={index} block>{part.slice(2, -2)}</Latex>;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        return <Latex key={index}>{part.slice(1, -1)}</Latex>;
      }
      
      // Handle Bold markdown (**text**)
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return (
         <span key={index}>
           {boldParts.map((subPart, subIndex) => {
             if (subPart.startsWith('**') && subPart.endsWith('**')) {
               return <strong key={subIndex} className="font-bold text-slate-900">{subPart.slice(2, -2)}</strong>;
             }
             return subPart;
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
                  <ListTag key={`list-${elements.length}`} className={`${listClass} list-inside mb-4 space-y-2 pl-4 text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100`}>
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
              elements.push(<p key={`p-${i}`} className="mb-4 text-slate-700 leading-relaxed text-lg">{renderInline(trimmed)}</p>);
          }
      });

      flushList();
      return elements;
  };

  return (
    <div id={data.id} className={`scroll-mt-24 bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${isCompleted ? 'border-green-500' : 'border-blue-500'} mb-6`}>
      <div className="p-6 sm:p-8">
        {data.title && (
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 pb-4 border-b border-slate-100">
            <span className="text-2xl">📚</span> {renderInline(data.title)}
          </h2>
        )}
        <div className="max-w-none">
          {renderStructuredContent(data.content)}
        </div>
        
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