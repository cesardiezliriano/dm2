
import React, { useEffect, useState } from 'react';
import { Language, UIStringKeys, StrategySessionData } from '../types';
import { getText } from '../constants';
import { XMarkIcon, DocumentTextIcon } from './Icons';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLoadSession: (session: StrategySessionData) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, lang, onLoadSession }) => {
  const [sessions, setSessions] = useState<StrategySessionData[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = () => {
    const allKeys = Object.keys(localStorage);
    const loadedSessions: StrategySessionData[] = [];
    allKeys.forEach(key => {
      if (key.startsWith('dm2_session_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '');
          if (data && data.diagnosis) {
            loadedSessions.push(data);
          }
        } catch (e) {
          console.error("Error parsing session", key);
        }
      }
    });
    // Sort by last modified descending
    loadedSessions.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
    setSessions(loadedSessions);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(getText(lang, UIStringKeys.ConfirmDelete))) {
        localStorage.removeItem(`dm2_session_${id}`);
        loadSessions(); // Reload list
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0A263B]/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fadeIn">
      <div className="bg-white text-[#0A263B] shadow-2xl rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <header className="flex items-center justify-between p-6 border-b border-[#DDDDDD]">
          <h2 className="text-xl font-semibold text-[#F54963] font-['Montserrat']">
            {getText(lang, UIStringKeys.HistoryModalTitle)}
          </h2>
          <button onClick={onClose} className="text-[#878E90] hover:text-[#F54963] transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
          {sessions.length === 0 ? (
            <p className="text-center text-[#6D7475] font-['Open_Sans'] py-8">
              {getText(lang, UIStringKeys.HistoryEmpty)}
            </p>
          ) : (
            <ul className="space-y-4">
              {sessions.map(session => (
                <li key={session.id} className="border border-[#DDDDDD] rounded-lg p-4 hover:shadow-md transition-shadow bg-[#F8F8F8]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[#0A263B] font-['Montserrat'] text-lg">
                        {session.diagnosis.clientName || "Untitled Project"}
                      </h4>
                      <p className="text-xs text-[#878E90] font-['Open_Sans'] mt-1">
                        {getText(lang, UIStringKeys.LabelLastModified)}: {new Date(session.lastModified).toLocaleString()}
                      </p>
                      <p className="text-sm text-[#6D7475] mt-2 font-['Open_Sans'] truncate max-w-xs md:max-w-md">
                         {session.diagnosis.businessChallenge || "No challenge defined yet."}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => { onLoadSession(session); onClose(); }}
                            className="px-3 py-1.5 bg-[#36A7B7] text-white text-sm rounded hover:bg-[#2A8E9D] transition-colors font-['Montserrat']"
                        >
                            {getText(lang, UIStringKeys.ButtonLoad)}
                        </button>
                        <button
                            onClick={(e) => handleDelete(session.id, e)}
                            className="px-3 py-1.5 bg-[#DDDDDD] text-[#6D7475] text-sm rounded hover:bg-red-100 hover:text-red-600 transition-colors font-['Montserrat']"
                        >
                             {getText(lang, UIStringKeys.ButtonDelete)}
                        </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
