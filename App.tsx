
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
import { initialDiagnosisData, initialFormulatedChallenge, getText } from './constants';
import { ArrowLeftIcon, ArrowRightIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.DIAGNOSIS);
  const [sessionData, setSessionData] = useState<StrategySessionData>({
    diagnosis: { ...initialDiagnosisData },
    challenge: { ...initialFormulatedChallenge },
    generatedPrompts: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.ES);


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

  const updateDiagnosis = useCallback((data: Partial<DiagnosisData>) => {
    setSessionData(prev => ({ ...prev, diagnosis: { ...prev.diagnosis, ...data } }));
  }, []);
  
  const updateChallenge = useCallback((data: Partial<FormulatedChallenge>) => {
    setSessionData(prev => ({ ...prev, challenge: { ...prev.challenge, ...data } }));
  }, []);

  const updatePrompts = useCallback((prompts: string[]) => {
    setSessionData(prev => ({ ...prev, generatedPrompts: prompts }));
  }, []);

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
      <header className="mb-8 text-center relative">
        <div className="absolute top-0 left-0 font-['Montserrat'] text-2xl font-bold text-[#F54963] uppercase">
          LLYC
        </div>
        <h1 className="font-['Montserrat'] text-2xl md:text-3xl font-bold text-[#F54963] mt-10">
          {getText(currentLanguage, UIStringKeys.AppName)}
        </h1>
        <p className="text-[#6D7475] mt-2 font-['Open_Sans']">{getText(currentLanguage, UIStringKeys.AppSubtitle)}</p>
        <div className="absolute top-0 right-0 flex space-x-2">
          <button 
            onClick={() => setCurrentLanguage(Language.EN)}
            className={`px-3 py-1 text-xs font-['Montserrat'] rounded-md ${currentLanguage === Language.EN ? 'bg-[#F54963] text-white' : 'bg-[#DDDDDD] text-[#0A263B] hover:bg-[#ACB4B6]'}`}
            aria-pressed={currentLanguage === Language.EN}
            aria-label={getText(currentLanguage, UIStringKeys.LanguageToggleEN)}
          >
            {getText(currentLanguage, UIStringKeys.LanguageToggleEN)}
          </button>
          <button 
            onClick={() => setCurrentLanguage(Language.ES)}
            className={`px-3 py-1 text-xs font-['Montserrat'] rounded-md ${currentLanguage === Language.ES ? 'bg-[#F54963] text-white' : 'bg-[#DDDDDD] text-[#0A263B] hover:bg-[#ACB4B6]'}`}
            aria-pressed={currentLanguage === Language.ES}
            aria-label={getText(currentLanguage, UIStringKeys.LanguageToggleES)}
          >
            {getText(currentLanguage, UIStringKeys.LanguageToggleES)}
          </button>
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
    </div>
  );
};

export default App;
