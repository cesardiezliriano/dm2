
import React, { useState, useEffect, useRef } from 'react';
import { Language, UIStringKeys, HelpTopic as HelpTopicType } from '../types';
import { getText, HELP_TOPICS_LIST } from '../constants';
import { XMarkIcon, CpuChipIcon } from './Icons';
// Not using Card component here to have more fine-grained control over modal structure

interface HelpBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const HelpBotModal: React.FC<HelpBotModalProps> = ({ isOpen, onClose, lang }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      setSelectedTopicId(null); 
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && event.target === modalRef.current) {
      onClose();
    }
  };
  
  const renderContent = (contentKey: UIStringKeys) => {
    const text = getText(lang, contentKey);
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className={`font-['Open_Sans'] ${index > 0 ? "mt-2" : ""}`}>{paragraph}</p>
    ));
  };

  if (!isOpen) return null;

  const selectedTopic = HELP_TOPICS_LIST.find(topic => topic.id === selectedTopicId);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-[#0A263B]/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fadeIn" /* LLYC Dark Blue overlay */
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div className="bg-white text-[#0A263B] shadow-2xl rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"> {/* LLYC White bg, Dark Blue text */}
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-[#DDDDDD]"> {/* LLYC Gris 04 border */}
          <div className="flex items-center space-x-3">
            <CpuChipIcon className="w-7 h-7 text-[#36A7B7]" /> {/* LLYC Turquoise icon */}
            <h2 id="help-modal-title" className="text-xl md:text-2xl font-semibold text-[#F54963] font-['Montserrat']"> {/* LLYC Red title */}
              {getText(lang, UIStringKeys.HelpModalTitle)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#878E90] hover:text-[#F54963] transition-colors" /* LLYC Gris 02, hover Red */
            aria-label={getText(lang, UIStringKeys.HelpModalCloseButtonSR)}
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-grow flex flex-col md:flex-row overflow-y-auto">
          {/* Left Pane: Navigation Menu */}
          <nav className="w-full md:w-1/3 bg-[#F8F8F8] p-4 md:p-6 border-b md:border-b-0 md:border-r border-[#DDDDDD] overflow-y-auto"> {/* LLYC Light Gray bg, Gris 04 border */}
            <h3 className="text-lg font-semibold text-[#36A7B7] mb-4 font-['Montserrat']">{getText(lang, UIStringKeys.HelpModalTopicsHeader)}</h3> {/* LLYC Turquoise */}
            <ul className="space-y-2">
              {HELP_TOPICS_LIST.map((topic) => (
                <li key={topic.id}>
                  <button
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors font-['Montserrat'] ${
                      selectedTopicId === topic.id
                        ? 'bg-[#F54963] text-white font-medium' // LLYC Red selected
                        : 'text-[#0A263B] hover:bg-[#DDDDDD] hover:text-[#0A263B]' // Dark Blue text, Gris 04 hover bg
                    }`}
                  >
                    {getText(lang, topic.questionKey)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Pane: Content Display Area */}
          <main className="w-full md:w-2/3 p-4 md:p-6 overflow-y-auto text-[#0A263B]"> {/* LLYC Dark Blue text */}
            {!selectedTopicId && (
              <div className="space-y-3">
                {renderContent(UIStringKeys.HelpModalIntro)}
                <p className="mt-4 italic text-[#6D7475] font-['Open_Sans']">{getText(lang, UIStringKeys.HelpModalDefaultContent)}</p> {/* LLYC Gris 01 */}
              </div>
            )}
            {selectedTopic && (
              <article className="space-y-3">
                 <h3 className="text-lg font-semibold text-[#36A7B7] mb-2 font-['Montserrat']">{getText(lang, selectedTopic.questionKey)}</h3> {/* LLYC Turquoise */}
                {renderContent(selectedTopic.answerKey)}
              </article>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HelpBotModal;