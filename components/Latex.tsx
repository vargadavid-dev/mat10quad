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
    return <span>{children}</span>;
  }

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export default Latex;