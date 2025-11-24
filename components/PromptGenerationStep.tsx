
import React, { useCallback, useEffect } from 'react';
import { FormulatedChallenge, GroundingChunk, Language, UIStringKeys, DiagnosisData } from '../types';
import { generateSmartPrompts } from '../services/geminiService';
import { getText } from '../constants';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';
import Card from './common/Card';
import { SparklesIcon } from './Icons';

interface PromptGenerationStepProps {
  challengeData: FormulatedChallenge;
  diagnosisData: DiagnosisData;
  generatedPrompts: string[];
  onUpdatePrompts: (prompts: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
  error: string | null;
  lang: Language;
}

const PromptGenerationStep: React.FC<PromptGenerationStepProps> = ({
  challengeData,
  diagnosisData,
  generatedPrompts,
  onUpdatePrompts,
  setLoading,
  setError,
  isLoading,
  error,
  lang,
}) => {
  const [groundingChunks, setGroundingChunks] = React.useState<GroundingChunk[] | undefined>(undefined);

  const isChallengeKernelReady = !!(challengeData.rumeltDiagnosis && challengeData.rumeltGuidingPolicy);

  const handleGeneratePrompts = useCallback(async () => {
    if (!isChallengeKernelReady) { 
      setError(getText(lang, UIStringKeys.ErrorChallengeNotFormulated)); 
      return;
    }
    setError(null);
    setLoading(true);
    setGroundingChunks(undefined);
    try {
      // Pass diagnosisData to include budget context
      const { prompts, groundingChunks: chunks } = await generateSmartPrompts(challengeData, diagnosisData, lang);
      onUpdatePrompts(prompts);
      if (chunks) setGroundingChunks(chunks);
    } catch (err) {
      setError(err instanceof Error ? err.message : getText(lang, UIStringKeys.ErrorGeneric)); 
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [challengeData, diagnosisData, onUpdatePrompts, setLoading, setError, lang, isChallengeKernelReady]);


  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-[#36A7B7] mb-2 flex items-center font-['Montserrat']"> 
        <SparklesIcon className="w-7 h-7 mr-2 text-[#36A7B7]" /> 
        {getText(lang, UIStringKeys.HeaderSmartPrompts)}
      </h2>
      <p className="text-[#6D7475] mb-6 font-['Open_Sans']"> 
        {getText(lang, UIStringKeys.DescriptionSmartPrompts)}
      </p>

      <Button
        onClick={handleGeneratePrompts}
        isLoading={isLoading}
        disabled={isLoading || !isChallengeKernelReady}
        icon={<SparklesIcon className="w-5 h-5" />}
        variant="primary"
      >
        {generatedPrompts.length > 0 
            ? getText(lang, UIStringKeys.ButtonRegeneratePrompts) 
            : getText(lang, UIStringKeys.ButtonGenerateSmartPrompts)}
      </Button>

      {error && <p className="text-[#F54963] bg-[#F54963]/10 p-3 rounded-md animate-shake font-['Open_Sans']">{error}</p>}
      
      {isLoading && generatedPrompts.length === 0 && (
         <div className="flex flex-col items-center justify-center p-10 bg-white/50 rounded-lg border border-[#DDDDDD]"> 
          <LoadingSpinner size="lg" lang={lang}/>
          <p className="mt-4 text-[#36A7B7] font-['Open_Sans']">{getText(lang, UIStringKeys.MessageGeneratingPrompts)}</p>
        </div>
      )}

      {generatedPrompts.length > 0 && !isLoading && (
        <Card title={getText(lang, UIStringKeys.HeaderGeneratedIdeationPrompts)} className="mt-6"> 
          <ul className="space-y-4">
            {generatedPrompts.map((prompt, index) => (
              <li key={index} className="p-4 bg-[#F8F8F8] border border-[#DDDDDD] rounded-lg shadow"> 
                <p className="text-[#0A263B] font-['Open_Sans']">{prompt}</p> 
              </li>
            ))}
          </ul>
        </Card>
      )}
       {groundingChunks && groundingChunks.length > 0 && (
        <Card title={getText(lang, UIStringKeys.HeaderInformationSources)} className="mt-6"> 
          <ul className="list-disc list-inside space-y-1">
            {groundingChunks.map((chunk, index) => (
              (chunk.web || chunk.retrievedContext) && (
                <li key={index} className="text-sm text-[#6D7475] font-['Open_Sans']"> 
                  <a 
                    href={chunk.web?.uri || chunk.retrievedContext?.uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#36A7B7] hover:text-[#F54963] hover:underline"
                  >
                    {chunk.web?.title || chunk.retrievedContext?.title || chunk.web?.uri || chunk.retrievedContext?.uri}
                  </a>
                </li>
              )
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default PromptGenerationStep;
