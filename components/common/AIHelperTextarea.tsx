import React, { useState, useRef, useEffect } from 'react';
import { DiagnosisData, Language } from '../../types';
import { suggestContextualItem } from '../../services/geminiService';
import { SparklesIcon, XMarkIcon } from '../Icons';
import LoadingSpinner from './LoadingSpinner';

interface AIHelperTextareaProps {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  diagnosisContext: Partial<DiagnosisData>;
  lang: Language;
  apiLabel: string; // The text to send to the AI to identify the field
  label?: string; // The visible label for the field, optional
  rows?: number;
}

const AIHelperTextarea: React.FC<AIHelperTextareaProps> = ({ 
  id, 
  name, 
  label,
  apiLabel,
  value, 
  placeholder, 
  onChange, 
  diagnosisContext, 
  lang, 
  rows = 4 
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setShowSuggestions(true);
    setSuggestions([]);
    try {
      const result = await suggestContextualItem(apiLabel, value, diagnosisContext, lang);
      setSuggestions(result.length > 0 ? result : ["No suggestions found."]);
    } catch (e) {
      console.error(e);
      setSuggestions(['Failed to load suggestions.']);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    // Prevent action if it's a "failed to load" message
    if (suggestion.toLowerCase().includes('failed') || suggestion.toLowerCase().includes('no suggestions')) {
      return;
    }
    const event = {
      target: { name, value: suggestion }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(event);
    setShowSuggestions(false);
  };
  
  const labelHeightClass = label ? 'top-9' : 'top-2';

  return (
    <div className="mb-4" ref={containerRef}>
      <div className="relative">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[#0A263B] mb-1 font-['Open_Sans']">
            {label}
          </label>
        )}
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-2.5 pr-12 bg-white border border-[#ACB4B6] rounded-lg text-[#0A263B] placeholder-[#ACB4B6] focus:ring-2 focus:ring-[#36A7B7] focus:border-[#36A7B7] outline-none transition-colors duration-150 font-['Open_Sans']"
        />
        <div className={`absolute ${labelHeightClass} right-2`}>
          <button
            type="button"
            onClick={handleGetSuggestions}
            disabled={isLoading && showSuggestions}
            className="p-1.5 text-[#36A7B7] hover:bg-[#36A7B7]/10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#36A7B7]"
            title="Get AI Suggestions"
          >
            {isLoading && showSuggestions ? <LoadingSpinner size="sm" /> : <SparklesIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[#DDDDDD] rounded-md shadow-lg animate-fadeIn">
          <div className="flex justify-between items-center p-2 border-b border-[#DDDDDD]">
            <h4 className="text-xs font-semibold text-[#6D7475] font-['Montserrat']">AI Suggestions</h4>
            <button onClick={() => setShowSuggestions(false)} className="p-1 text-[#878E90] hover:text-[#F54963]">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          {isLoading ? (
              <div className="flex justify-center items-center p-4">
                  <LoadingSpinner size="md" lang={lang} />
              </div>
          ) : (
              <ul className="py-1 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2 text-sm text-[#0A263B] hover:bg-[#F8F8F8] transition-colors disabled:opacity-50 disabled:cursor-default font-['Open_Sans']"
                        disabled={suggestion.toLowerCase().includes('failed') || suggestion.toLowerCase().includes('no suggestions')}
                    >
                        {suggestion}
                    </button>
                  </li>
              ))}
              </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AIHelperTextarea;
