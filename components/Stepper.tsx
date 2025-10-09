import React from 'react';
import { AppStep, Language, UIStringKeys } from '../types';
import { getText } from '../constants';

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

// FIX: Added StepperProps interface definition to resolve the 'Cannot find name' error.
interface StepperProps {
  steps: AppStep[];
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;
  lang: Language;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, setCurrentStep, lang }) => {
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <nav className="mb-8 w-full" aria-label={getText(lang, UIStringKeys.StepperAriaLabel)}>
      <ol role="list" className="grid grid-cols-2 text-center md:grid-cols-4 gap-x-6 gap-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;
          
          let iconContainerClasses = 'border-2 border-[#ACB4B6]'; // Upcoming
          let textClasses = 'text-[#ACB4B6]'; // Upcoming
          let numberClasses = 'text-[#ACB4B6]';

          if (isCompleted) {
            iconContainerClasses = 'bg-[#F54963] border-transparent';
            textClasses = 'text-[#0A263B]';
          }
          if (isCurrent) {
            iconContainerClasses = 'border-2 border-[#F54963]';
            textClasses = 'text-[#F54963] font-bold';
            numberClasses = 'text-[#F54963]';
          }
          
          return (
            <li key={step}>
              <button
                onClick={() => setCurrentStep(step)}
                disabled={isUpcoming}
                className="flex flex-col items-center w-full group disabled:cursor-not-allowed"
              >
                {/* Icon Container */}
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold transition-colors duration-150 ${iconContainerClasses} ${!isUpcoming ? 'group-hover:border-[#878E90]' : ''}`}>
                  {isCompleted ? (
                    <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.454-12.68a.75.75 0 011.04-.208z" clipRule="evenodd" />
                    </svg>
                  ) : (
                     <span className={`transition-colors duration-150 ${numberClasses} ${!isUpcoming ? 'group-hover:text-[#6D7475]' : ''}`}>{index + 1}</span>
                  )}
                </div>
                {/* Text Label */}
                <span className={`mt-2 text-xs md:text-sm font-medium transition-colors duration-150 font-['Montserrat'] ${textClasses} ${!isUpcoming ? 'group-hover:text-[#6D7475]' : ''}`}>
                  {getText(lang, getStepTranslationKey(step))}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Stepper;