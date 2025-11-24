
import React, { useState, useCallback, useEffect } from 'react';
import { DiagnosisData, FormulatedChallenge, StrategySessionData, AppStep, FunnelStage, InvolvementLevel, Language, UIStringKeys } from './types';
import DiagnosisStep from './components/DiagnosisStep';
import ChallengeFormulationStep from './components/ChallengeFormulationStep';
import PromptGenerationStep from './components/PromptGenerationStep';
import ResultsStep from './components/ResultsStep';
import Stepper from './components/Stepper';
import HelpBotButton from './components/HelpBotButton';
import HelpBotModal from './components/HelpBotModal';
import FeedbackButton from './components/FeedbackButton';
import HistoryModal from './components/HistoryModal'; // Import
import { initialDiagnosisData, initialFormulatedChallenge, getText } from './constants';
import { ArrowLeftIcon, ArrowRightIcon, DocumentTextIcon } from './components/Icons';

const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.DIAGNOSIS);
  
  // Initialize with an ID for persistence
  const [sessionData, setSessionData] = useState<StrategySessionData>({
    id: generateId(),
    lastModified: Date.now(),
    diagnosis: { ...initialDiagnosisData },
    challenge: { ...initialFormulatedChallenge },
    generatedPrompts: [],
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false); // New State
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.ES);

  // AUTO SAVE EFFECT
  useEffect(() => {
      if (sessionData.diagnosis.clientName || sessionData.diagnosis.businessChallenge) {
          const key = `dm2_session_${sessionData.id}`;
          localStorage.setItem(key, JSON.stringify(sessionData));
      }
  }, [sessionData]);

  const stepsOrder: AppStep[] = [
    AppStep.DIAGNOSIS,
    AppStep.CHALLENGE_FORMULATION,
    AppStep.PROMPT_GENERATION,
    AppStep.RESULTS,
  ];

  const currentStepIndex = stepsOrder.indexOf(currentStep);

  const handleNext = useCallback(() => {
    if (currentStepIndex < stepsOrder.length - 1) {
      setCurrentStep(stepsOrder[currentStepIndex + 1]);
      setError(null); 
    }
  }, [currentStepIndex, stepsOrder]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStep(stepsOrder[currentStepIndex - 1]);
      setError(null);
    }
  }, [currentStepIndex, stepsOrder]);

  // Update wrappers to update timestamp
  const updateDiagnosis = useCallback((data: Partial<DiagnosisData>) => {
    setSessionData(prev => ({ 
        ...prev, 
        lastModified: Date.now(),
        diagnosis: { ...prev.diagnosis, ...data } 
    }));
  }, []);
  
  const updateChallenge = useCallback((data: Partial<FormulatedChallenge>) => {
    setSessionData(prev => ({ 
        ...prev, 
        lastModified: Date.now(),
        challenge: { ...prev.challenge, ...data } 
    }));
  }, []);

  const updatePrompts = useCallback((prompts: string[]) => {
    setSessionData(prev => ({ 
        ...prev, 
        lastModified: Date.now(),
        generatedPrompts: prompts 
    }));
  }, []);

  // History Actions
  const handleLoadSession = (data: StrategySessionData) => {
      setSessionData(data);
      setCurrentStep(AppStep.DIAGNOSIS); // Reset to start or maybe infer step?
      setIsHistoryModalOpen(false);
  };

  const handleNewSession = () => {
      if (confirm(getText(currentLanguage, UIStringKeys.NewSessionConfirm))) {
        setSessionData({
            id: generateId(),
            lastModified: Date.now(),
            diagnosis: { ...initialDiagnosisData },
            challenge: { ...initialFormulatedChallenge },
            generatedPrompts: [],
        });
        setCurrentStep(AppStep.DIAGNOSIS);
      }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case AppStep.DIAGNOSIS:
        return (
          <DiagnosisStep
            data={sessionData.diagnosis}
            onUpdate={updateDiagnosis}
            isLoading={isLoading}
            error={error}
            lang={currentLanguage}
          />
        );
      case AppStep.CHALLENGE_FORMULATION:
        return (
          <ChallengeFormulationStep
            diagnosisData={sessionData.diagnosis}
            challengeData={sessionData.challenge}
            onUpdateChallenge={updateChallenge}
            setLoading={setIsLoading}
            setError={setError}
            isLoading={isLoading}
            error={error}
            lang={currentLanguage}
          />
        );
      case AppStep.PROMPT_GENERATION:
        return (
          <PromptGenerationStep
            challengeData={sessionData.challenge}
            diagnosisData={sessionData.diagnosis}
            generatedPrompts={sessionData.generatedPrompts}
            onUpdatePrompts={updatePrompts}
            setLoading={setIsLoading}
            setError={setError}
            isLoading={isLoading}
            error={error}
            lang={currentLanguage}
          />
        );
      case AppStep.RESULTS:
        return <ResultsStep data={sessionData} lang={currentLanguage} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-xl p-6 md:p-10 w-full min-h-[80vh] flex flex-col text-[#0A263B]">
      <header className="mb-8 relative flex flex-col items-center w-full">
        {/* Logo Left */}
        <div className="absolute top-0 left-0 flex items-center p-1">
             <div className="font-['Montserrat'] text-2xl font-bold text-[#F54963] uppercase">
                LLYC
            </div>
        </div>
        
        {/* Right Controls Container: Flex Column, Right Aligned */}
        <div className="absolute top-0 right-0 flex flex-col items-end gap-3 z-10 p-1">
          
          {/* Row 1: Language Toggles */}
          <div className="flex space-x-1 bg-[#F0F0F0] p-1 rounded-md">
            <button 
                onClick={() => setCurrentLanguage(Language.EN)}
                className={`px-3 py-1 text-xs font-['Montserrat'] rounded-sm transition-colors ${currentLanguage === Language.EN ? 'bg-[#F54963] text-white shadow-sm' : 'text-[#6D7475] hover:bg-gray-200'}`}
                aria-pressed={currentLanguage === Language.EN}
                aria-label={getText(currentLanguage, UIStringKeys.LanguageToggleEN)}
            >
                {getText(currentLanguage, UIStringKeys.LanguageToggleEN)}
            </button>
            <button 
                onClick={() => setCurrentLanguage(Language.ES)}
                className={`px-3 py-1 text-xs font-['Montserrat'] rounded-sm transition-colors ${currentLanguage === Language.ES ? 'bg-[#F54963] text-white shadow-sm' : 'text-[#6D7475] hover:bg-gray-200'}`}
                aria-pressed={currentLanguage === Language.ES}
                aria-label={getText(currentLanguage, UIStringKeys.LanguageToggleES)}
            >
                {getText(currentLanguage, UIStringKeys.LanguageToggleES)}
            </button>
          </div>

          {/* Row 2: Session Actions (Below Language) */}
          <div className="flex space-x-2">
             <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="px-3 py-1.5 text-xs font-['Montserrat'] font-medium rounded-md bg-[#36A7B7] text-white hover:bg-[#2A8E9D] shadow-sm transition-colors"
                title={getText(currentLanguage, UIStringKeys.ButtonHistory)}
            >
                {getText(currentLanguage, UIStringKeys.ButtonHistory)}
            </button>
             <button
                onClick={handleNewSession}
                className="px-3 py-1.5 text-xs font-['Montserrat'] font-medium rounded-md bg-[#878E90] text-white hover:bg-[#6D7475] shadow-sm transition-colors"
                title={getText(currentLanguage, UIStringKeys.ButtonNewSession)}
            >
                {getText(currentLanguage, UIStringKeys.ButtonNewSession)}
            </button>
          </div>

        </div>
       
        {/* Title Section: Added larger margin-top for mobile to clear controls, constrained width */}
        <div className="mt-24 md:mt-4 text-center w-full px-4">
          <h1 className="font-['Montserrat'] text-2xl md:text-3xl font-bold text-[#F54963] leading-tight mx-auto max-w-lg md:max-w-2xl">
            {getText(currentLanguage, UIStringKeys.AppName)}
          </h1>
          <p className="text-[#6D7475] mt-2 font-['Open_Sans'] text-sm md:text-base mx-auto max-w-lg">
            {getText(currentLanguage, UIStringKeys.AppSubtitle)}
          </p>
        </div>
      </header>
      
      <Stepper steps={stepsOrder} currentStep={currentStep} setCurrentStep={setCurrentStep} lang={currentLanguage} />

      <main className="flex-grow mt-8 relative">
        {renderStepContent()}
      </main>

      <footer className="mt-10 pt-6 border-t border-[#DDDDDD] flex justify-between items-center"> 
        <button
          onClick={handleBack}
          disabled={currentStepIndex === 0 || isLoading}
          className="px-6 py-3 bg-[#878E90] hover:bg-[#6D7475] text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out flex items-center space-x-2 font-['Montserrat']"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>{getText(currentLanguage, UIStringKeys.ButtonBack)}</span>
        </button>
        <div className="text-sm text-[#878E90] font-['Open_Sans']"> 
          {getText(currentLanguage, UIStringKeys.FooterStep, { current: currentStepIndex + 1, total: stepsOrder.length})}
        </div>
        <button
          onClick={handleNext}
          disabled={currentStepIndex === stepsOrder.length - 1 || isLoading}
          className="px-6 py-3 bg-[#F54963] hover:bg-[#D43A50] text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out flex items-center space-x-2 font-['Montserrat']"
        >
          <span>{getText(currentLanguage, UIStringKeys.ButtonNext)}</span>
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </footer>

      <HelpBotButton onClick={() => setIsHelpModalOpen(true)} lang={currentLanguage} />
      <FeedbackButton lang={currentLanguage} />
      
      <HelpBotModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)}
        lang={currentLanguage}
      />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        lang={currentLanguage}
        onLoadSession={handleLoadSession}
      />
    </div>
  );
};

export default App;
