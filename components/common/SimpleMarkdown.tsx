
import React from 'react';

interface SimpleMarkdownProps {
  text: string;
  className?: string;
}

const SimpleMarkdown: React.FC<SimpleMarkdownProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split text by newlines to process line by line
  const lines = text.split('\n');

  return (
    <div className={`space-y-2 font-['Open_Sans'] text-[#0A263B] ${className}`}>
      {lines.map((line, index) => {
        // Headers (###)
        if (line.startsWith('### ')) {
            return <h4 key={index} className="text-md font-bold text-[#36A7B7] mt-3 font-['Montserrat']">{parseInline(line.replace('### ', ''))}</h4>;
        }
        if (line.startsWith('## ')) {
            return <h3 key={index} className="text-lg font-bold text-[#F54963] mt-4 mb-2 font-['Montserrat']">{parseInline(line.replace('## ', ''))}</h3>;
        }
        if (line.startsWith('# ')) {
            return <h2 key={index} className="text-xl font-bold text-[#0A263B] mt-5 mb-3 font-['Montserrat']">{parseInline(line.replace('# ', ''))}</h2>;
        }

        // List Items (* or -)
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            const content = line.trim().substring(2);
            return (
                <div key={index} className="flex items-start ml-2">
                    <span className="mr-2 text-[#F54963]">•</span>
                    <span>{parseInline(content)}</span>
                </div>
            );
        }

        // Empty lines
        if (!line.trim()) {
            return <div key={index} className="h-2"></div>;
        }

        // Paragraphs
        return <p key={index} className="leading-relaxed">{parseInline(line)}</p>;
      })}
    </div>
  );
};

// Helper to parse bold (**text**) within a line
const parseInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold text-[#0A263B]">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

export default SimpleMarkdown;
