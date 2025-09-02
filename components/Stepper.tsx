
import React from 'react';
import { AppStep, Language, UIStringKeys } from '../types';
import { getText } from '../constants'; 

interface StepperProps {
  steps: AppStep[];
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;
  lang: Language;
}

const getStepTranslationKey = (step: AppStep): UIStringKeys => {
  switch (step) {
    case AppStep.DIAGNOSIS:
      return UIStringKeys.HeaderDiagnosis;
    case AppStep.CHALLENGE_FORMULATION:
      return UIStringKeys.HeaderChallengeFormulation;
    case AppStep.PROMPT_GENERATION:
      return UIStringKeys.HeaderSmartPrompts;
    case AppStep.RESULTS:
      return UIStringKeys.HeaderResults;
    default:
      const exhaustiveCheck: never = step;
      return exhaustiveCheck as UIStringKeys; 
  }
};


const Stepper: React.FC<StepperProps> = ({ steps, currentStep, setCurrentStep, lang }) => {
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <nav className="mb-8" aria-label={getText(lang, UIStringKeys.StepperAriaLabel)}>
      <ol role="list" className="flex flex-wrap items-center justify-center gap-y-4 gap-x-2 md:gap-x-6">
        {steps.map((step, index) => (
          <li key={step} className="relative">
            <button
              onClick={() => setCurrentStep(step)}
              className="flex items-center text-sm font-medium group font-['Montserrat']"
            >
              {index < currentStepIndex ? (
                // Completed step
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F54963] group-hover:bg-[#D43A50]">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.454-12.68a.75.75 0 011.04-.208z" clipRule="evenodd" />
                  </svg>
                </span>
              ) : index === currentStepIndex ? (
                // Current step
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#F54963]"> 
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F54963]"></span> 
                </span>
              ) : (
                // Upcoming step
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#ACB4B6] group-hover:border-[#878E90]"> 
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-[#ACB4B6]"></span> 
                </span>
              )}
              <span className={`ml-3 text-xs md:text-sm font-medium ${index <= currentStepIndex ? 'text-[#F54963]' : 'text-[#878E90] group-hover:text-[#6D7475]'}`}> 
                {getText(lang, getStepTranslationKey(step))}
              </span>
            </button>
            {index !== steps.length - 1 && (
                 <div className="absolute right-[-12px] md:right-[-24px] top-1/2 -translate-y-1/2 hidden md:block w-4 h-px bg-[#ACB4B6]" aria-hidden="true" /> 
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;
