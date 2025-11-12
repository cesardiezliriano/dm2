
import React, { useCallback, useEffect } from 'react';
import { DiagnosisData, FormulatedChallenge, GroundingChunk, Language, UIStringKeys } from '../types';
import { generateChallengeFormulation } from '../services/geminiService';
import { getText } from '../constants';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';
import Card from './common/Card';
import { LightBulbIcon, BrainIcon } from './Icons';
import AIHelperTextarea from './common/AIHelperTextarea';

interface ChallengeFormulationStepProps {
  diagnosisData: DiagnosisData;
  challengeData: FormulatedChallenge;
  onUpdateChallenge: (data: Partial<FormulatedChallenge>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
  error: string | null;
  lang: Language;
}

const ChallengeFormulationStep: React.FC<ChallengeFormulationStepProps> = ({
  diagnosisData,
  challengeData,
  onUpdateChallenge,
  setLoading,
  setError,
  isLoading,
  error,
  lang,
}) => {
  const [groundingChunks, setGroundingChunks] = React.useState<GroundingChunk[] | undefined>(undefined);

  const isDiagnosisIncomplete = !diagnosisData.customerType || !diagnosisData.market || !diagnosisData.sector || !diagnosisData.businessChallenge || !diagnosisData.customerChallenge;

  const handleGenerateChallenge = useCallback(async () => {
    if (isDiagnosisIncomplete) {
      setError(getText(lang, UIStringKeys.ErrorDiagnosisNotComplete)); 
      return;
    }
    setError(null);
    setLoading(true);
    setGroundingChunks(undefined);
    try {
      const { formulation, groundingChunks: chunks } = await generateChallengeFormulation(diagnosisData, lang);
      onUpdateChallenge(formulation);
      if (chunks) setGroundingChunks(chunks);
    } catch (err) {
      setError(err instanceof Error ? err.message : getText(lang, UIStringKeys.ErrorGeneric)); 
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [diagnosisData, onUpdateChallenge, setLoading, setError, lang, isDiagnosisIncomplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdateChallenge({ [name]: value });
  };
  
  const hasChallengeData = challengeData.rumeltDiagnosis || challengeData.rumeltGuidingPolicy;

  // Memoize labels to prevent re-renders inside the helper component
  const rumeltDiagnosisLabel = getText(lang, UIStringKeys.HeaderRumeltDiagnosis);
  const rumeltGuidingPolicyLabel = getText(lang, UIStringKeys.HeaderRumeltGuidingPolicy);
  const behavioralJustificationLabel = getText(lang, UIStringKeys.HeaderBehavioralJustification);
  const culturalTensionLabel = getText(lang, UIStringKeys.HeaderCulturalTension);
  const marketOpportunityLabel = getText(lang, UIStringKeys.HeaderMarketOpportunity);
  const consumerInsightLabel = getText(lang, UIStringKeys.HeaderConsumerInsight);
  const keyAssumptionsLabel = getText(lang, UIStringKeys.HeaderKeyAssumptions);
  const relevantMentalModelsLabel = getText(lang, UIStringKeys.HeaderRelevantMentalModels);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-[#36A7B7] mb-2 flex items-center font-['Montserrat']"> 
        <LightBulbIcon className="w-7 h-7 mr-2 text-[#FC6B08]" /> 
        {getText(lang, UIStringKeys.HeaderChallengeFormulation)}
      </h2>
      <p className="text-[#6D7475] mb-6 font-['Open_Sans']"> 
        {getText(lang, UIStringKeys.DescriptionChallengeFormulation)}
      </p>

      <Button
        onClick={handleGenerateChallenge}
        isLoading={isLoading}
        disabled={isLoading || isDiagnosisIncomplete}
        icon={<LightBulbIcon className="w-5 h-5" />}
        variant="primary"
      >
        {hasChallengeData 
            ? getText(lang, UIStringKeys.ButtonRegenerateChallenge) 
            : getText(lang, UIStringKeys.ButtonGenerateStrategicChallenge)}
      </Button>
      
      {isDiagnosisIncomplete && !isLoading && (
        <div className="text-center mt-4 p-4 bg-[#F8F8F8] border border-[#DDDDDD] rounded-lg animate-fadeIn" role="alert">
            <p className="text-sm text-[#6D7475] font-['Open_Sans']">
                {getText(lang, UIStringKeys.ErrorDiagnosisNotComplete)}
            </p>
        </div>
      )}

      {error && <p className="text-[#F54963] bg-[#F54963]/10 p-3 rounded-md animate-shake font-['Open_Sans']">{error}</p>}
      
      {isLoading && !hasChallengeData && (
        <div className="flex flex-col items-center justify-center p-10 bg-white/50 rounded-lg border border-[#DDDDDD]"> 
          <LoadingSpinner size="lg" lang={lang} />
          <p className="mt-4 text-[#36A7B7] font-['Open_Sans']">{getText(lang, UIStringKeys.MessageFormulatingChallenge)}</p> 
        </div>
      )}

      {(hasChallengeData || (challengeData.rumeltDiagnosis && challengeData.rumeltGuidingPolicy)) && !isLoading && (
         <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title={rumeltDiagnosisLabel} titleClassName="text-[#F54963]"> 
              <AIHelperTextarea id="rumeltDiagnosis" name="rumeltDiagnosis" apiLabel={rumeltDiagnosisLabel} value={challengeData.rumeltDiagnosis} onChange={handleInputChange} placeholder={getText(lang, UIStringKeys.PlaceholderAIWillGenerate)} diagnosisContext={diagnosisData} lang={lang} />
            </Card>
            <Card title={rumeltGuidingPolicyLabel} titleClassName="text-[#36A7B7]"> 
              <AIHelperTextarea id="rumeltGuidingPolicy" name="rumeltGuidingPolicy" apiLabel={rumeltGuidingPolicyLabel} value={challengeData.rumeltGuidingPolicy} onChange={handleInputChange} placeholder={getText(lang, UIStringKeys.PlaceholderAIWillGenerate)} diagnosisContext={diagnosisData} lang={lang} />
            </Card>
            {/* FIX: Combined the Card and AIHelperTextarea for 'Behavioral Justification' to fix a layout bug and improve UI consistency. */}
            <Card 
              title={
                <>
                  <BrainIcon className="w-5 h-5 mr-2" />
                  {behavioralJustificationLabel}
                </>
              }
              titleClassName="text-[#FC6B08] flex items-center"
            >
              <AIHelperTextarea id="behavioralJustification" name="behavioralJustification" apiLabel={behavioralJustificationLabel} value={challengeData.behavioralJustification} onChange={handleInputChange} placeholder={getText(lang, UIStringKeys.PlaceholderAIWillGenerate)} diagnosisContext={diagnosisData} lang={lang} />
            </Card>

            <Card title={culturalTensionLabel} titleClassName="text-[#8B8BB2]"> 
              <AIHelperTextarea id="culturalTension" name="culturalTension" apiLabel={culturalTensionLabel} value={challengeData.culturalTension} onChange={handleInputChange} placeholder={getText(lang, UIStringKeys.PlaceholderAIWillGenerate)} diagnosisContext={diagnosisData} lang={lang} />
            </Card>
            <Card title={marketOpportunityLabel} titleClassName="text-[#76CC9B]"> 
              <AIHelperTextarea id="marketOpportunity" name="marketOpportunity" apiLabel={marketOpportunityLabel} value={challengeData.marketOpportunity} onChange={handleInputChange} placeholder={getText(lang, UIStringKeys.PlaceholderAIWillGenerate)} diagnosisContext={diagnosisData} lang={lang}/>
            </Card>
            <Card title={consumerInsightLabel} titleClassName="text-[#FC6B08]"> 
              <AIHelperTextarea id="consumerInsight" name="consumerInsight" apiLabel={consumerInsightLabel} value={challengeData.consumerInsight} onChange={handleInputChange} placeholder={getText(lang, UIStringKeys.PlaceholderAIWillGenerate)} diagnosisContext={diagnosisData} lang={lang} />
            </Card>
            
            {(challengeData.keyAssumptions || challengeData.keyAssumptions === '') && ( 
              <Card title={keyAssumptionsLabel} titleClassName="text-[#0A263B]" > 
                <AIHelperTextarea id="keyAssumptions" name="keyAssumptions" apiLabel={keyAssumptionsLabel} value={challengeData.keyAssumptions} onChange={handleInputChange} placeholder={getText(lang, UIStringKeys.PlaceholderAIWillGenerate)} diagnosisContext={diagnosisData} lang={lang} />
              </Card>
            )}
            {(challengeData.relevantMentalModels || challengeData.relevantMentalModels === '') && (
              <Card title={relevantMentalModelsLabel} titleClassName="text-[#0A263B]"> 
                <AIHelperTextarea id="relevantMentalModels" name="relevantMentalModels" apiLabel={relevantMentalModelsLabel} value={challengeData.relevantMentalModels} onChange={handleInputChange} placeholder={getText(lang, UIStringKeys.PlaceholderAIWillGenerate)} diagnosisContext={diagnosisData} lang={lang} />
              </Card>
            )}
        </div>
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

export default ChallengeFormulationStep;
