
import React from 'react';
import { QuestionMarkCircleIcon } from './Icons';
import { Language, UIStringKeys } from '../types';
import { getText } from '../constants';

interface HelpBotButtonProps {
  onClick: () => void;
  lang: Language;
}

const HelpBotButton: React.FC<HelpBotButtonProps> = ({ onClick, lang }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 bg-[#36A7B7] hover:bg-[#2A8E9D] text-white p-3 md:p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#36A7B7] focus:ring-opacity-75 transition-all duration-150 ease-in-out group z-50" /* LLYC Turquoise */
      aria-label={getText(lang, UIStringKeys.HelpButtonTooltip)}
      title={getText(lang, UIStringKeys.HelpButtonTooltip)}
    >
      <QuestionMarkCircleIcon className="w-7 h-7 md:w-8 md:h-8" />
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-[#0A263B] text-xs text-white rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none font-['Open_Sans']"> {/* LLYC Dark Blue tooltip */}
        {getText(lang, UIStringKeys.HelpButtonTooltip)}
      </span>
    </button>
  );
};

export default HelpBotButton;