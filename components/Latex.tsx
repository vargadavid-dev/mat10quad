import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexProps {
  children: string;
  block?: boolean;
}

const Latex: React.FC<LatexProps> = ({ children, block = false }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children, {
        throwOnError: false,
        displayMode: block,
      });
    } catch (error) {
      console.error("KaTeX error:", error);
      return null;
    }
  }, [children, block]);

  if (html === null) {
    return <span className="text-slate-900 dark:text-slate-100">{children}</span>;
  }

  return <span className="text-slate-900 dark:text-slate-100" dangerouslySetInnerHTML={{ __html: html }} />;
};

export default Latex;