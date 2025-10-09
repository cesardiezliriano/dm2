import React from 'react';
import { ChatBubbleLeftEllipsisIcon } from './Icons';
import { Language, UIStringKeys } from '../types';
import { getText, FEEDBACK_EMAIL_RECIPIENTS } from '../constants';

interface FeedbackButtonProps {
  lang: Language;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ lang }) => {
  const appName = getText(lang, UIStringKeys.AppName);
  const subject = getText(lang, UIStringKeys.FeedbackEmailSubject).replace('[AppName]', appName);
  const body = getText(lang, UIStringKeys.FeedbackEmailBody).replace('[AppName]', appName);

  const handleFeedbackClick = () => {
    const mailtoLink = `mailto:${FEEDBACK_EMAIL_RECIPIENTS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <button
      onClick={handleFeedbackClick}
      className="fixed bottom-28 left-6 bg-[#F54963] hover:bg-[#D43A50] text-white p-3 md:p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F54963] focus:ring-opacity-75 transition-all duration-150 ease-in-out group z-50" /* LLYC Red */
      aria-label={getText(lang, UIStringKeys.FeedbackButtonTooltip)}
      title={getText(lang, UIStringKeys.FeedbackButtonTooltip)}
    >
      <ChatBubbleLeftEllipsisIcon className="w-7 h-7 md:w-8 md:h-8" />
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-[#0A263B] text-xs text-white rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none font-['Open_Sans']"> {/* LLYC Dark Blue tooltip */}
        {getText(lang, UIStringKeys.FeedbackButtonTooltip)}
      </span>
    </button>
  );
};

export default FeedbackButton;