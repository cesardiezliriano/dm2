import React, { ChangeEvent, useRef } from 'react';
import { DiagnosisData, FunnelStage, InvolvementLevel, Language, UIStringKeys } from '../types';
import { defaultFunnelStages, defaultInvolvementLevels, getText } from '../constants';
import Input from './common/Input';
import Textarea from './common/Textarea';
import Select from './common/Select';
import Card from './common/Card';
import { AcademicCapIcon, DocumentTextIcon, XMarkIcon } from './Icons';
import Button from './common/Button'; 
import AIHelperTextarea from './common/AIHelperTextarea';

interface DiagnosisStepProps {
  data: DiagnosisData;
  onUpdate: (data: Partial<DiagnosisData>) => void;
  isLoading: boolean;
  error: string | null;
  lang: Language;
}

const DiagnosisStep: React.FC<DiagnosisStepProps> = ({ data, onUpdate, lang }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "involvement" || name === "funnelStage") {
      onUpdate({
        consumerContext: {
          ...data.consumerContext,
          [name]: value as InvolvementLevel | FunnelStage,
        },
      });
    } else if (name === "barriers") {
       onUpdate({
        consumerContext: {
          ...data.consumerContext,
          barriers: value,
        },
      });
    }
    else {
      onUpdate({ [name]: value });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onUpdate({ briefingFileName: file.name });
    } else if (file) {
      alert(getText(lang, UIStringKeys.AlertNonPDF));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onUpdate({ briefingFileName: null });
    }
  };

  const handleRemoveFile = () => {
    onUpdate({ briefingFileName: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const funnelStageOptions = defaultFunnelStages.map(stage => ({ value: stage, label: stage }));
  const involvementLevelOptions = defaultInvolvementLevels.map(level => ({ value: level, label: level }));
  
  const coreProblemLabel = getText(lang, UIStringKeys.LabelCoreProblem);

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-[#36A7B7] flex items-center font-['Montserrat']"> 
          <AcademicCapIcon className="w-7 h-7 mr-2 text-[#36A7B7]" /> 
          {getText(lang, UIStringKeys.HeaderDiagnosis)}
        </h2>
        <p className="text-[#6D7475] mt-1 font-['Open_Sans']"> 
          {getText(lang, UIStringKeys.DescriptionDiagnosis)}
        </p>
      </header>

      <Card title={getText(lang, UIStringKeys.HeaderProjectSetup)}>
        <Input 
          label={getText(lang, UIStringKeys.LabelClientName)} 
          id="clientName" 
          name="clientName" 
          value={data.clientName} 
          onChange={handleChange} 
          placeholder="e.g., Acme Corp, LLYC Foundation" 
        />
        <Input
          label={getText(lang, UIStringKeys.LabelProjectBudget)}
          id="projectBudget"
          name="projectBudget"
          value={data.projectBudget}
          onChange={handleChange}
          placeholder="e.g., 50,000 - 75,000 USD, or 'Not defined'"
        />
        <div>
          <label htmlFor="briefingFile" className="block text-sm font-medium text-[#0A263B] mb-1 font-['Open_Sans']">
            {getText(lang, UIStringKeys.LabelUploadBriefing)}
          </label>
          <div className="flex items-center space-x-2">
            <label 
              htmlFor="briefingFile" 
              className="cursor-pointer px-4 py-2.5 bg-[#878E90] hover:bg-[#6D7475] text-white font-semibold rounded-lg shadow-md text-sm inline-flex items-center font-['Montserrat']"
            >
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              {getText(lang, UIStringKeys.ButtonChooseFile)}
            </label>
            <input
              type="file"
              id="briefingFile"
              name="briefingFile"
              accept=".pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            {data.briefingFileName ? (
              <div className="flex items-center space-x-2 text-sm text-[#0A263B] bg-gray-100 px-3 py-1.5 rounded-md">
                <span>{getText(lang, UIStringKeys.FileSelected, { fileName: data.briefingFileName })}</span>
                <button 
                  onClick={handleRemoveFile} 
                  className="text-[#F54963] hover:text-[#D43A50]"
                  title={getText(lang, UIStringKeys.ButtonRemoveFile)}
                  type="button"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <span className="text-sm text-[#ACB4B6] font-['Open_Sans']">{getText(lang, UIStringKeys.PlaceholderNoFileSelected)}</span>
            )}
          </div>
        </div>
      </Card>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title={getText(lang, UIStringKeys.HeaderBusinessMarketContext)}>
          <Input label={getText(lang, UIStringKeys.LabelCustomerType)} id="customerType" name="customerType" value={data.customerType} onChange={handleChange} placeholder={getText(lang, UIStringKeys.PlaceholderCustomerType)} />
          <Input label={getText(lang, UIStringKeys.LabelMarketCategory)} id="market" name="market" value={data.market} onChange={handleChange} placeholder={getText(lang, UIStringKeys.PlaceholderMarketCategory)} />
          <Input label={getText(lang, UIStringKeys.LabelSectorIndustry)} id="sector" name="sector" value={data.sector} onChange={handleChange} placeholder={getText(lang, UIStringKeys.PlaceholderSectorIndustry)} />
          <Input label={getText(lang, UIStringKeys.LabelProductService)} id="productOrService" name="productOrService" value={data.productOrService} onChange={handleChange} placeholder={getText(lang, UIStringKeys.PlaceholderProductService)} />
        </Card>

        <Card title={getText(lang, UIStringKeys.HeaderProblemConsumerContext)}>
          <AIHelperTextarea
            id="coreProblemToSolve"
            name="coreProblemToSolve"
            label={coreProblemLabel}
            apiLabel={coreProblemLabel}
            value={data.coreProblemToSolve}
            onChange={handleChange}
            placeholder={getText(lang, UIStringKeys.PlaceholderCoreProblem)}
            diagnosisContext={data}
            lang={lang}
          />
          <Select label={getText(lang, UIStringKeys.LabelConsumerInvolvement)} id="involvement" name="involvement" value={data.consumerContext.involvement} onChange={handleChange} options={involvementLevelOptions} lang={lang} />
          <Select label={getText(lang, UIStringKeys.LabelFunnelStage)} id="funnelStage" name="funnelStage" value={data.consumerContext.funnelStage} onChange={handleChange} options={funnelStageOptions} lang={lang} />
          <Textarea label={getText(lang, UIStringKeys.LabelConsumerBarriers)} id="barriers" name="barriers" value={data.consumerContext.barriers} onChange={handleChange} placeholder={getText(lang, UIStringKeys.PlaceholderConsumerBarriers)} />
        </Card>
      </div>
      <Card title={getText(lang, UIStringKeys.HeaderCurrentEffortsOptional)}>
         <Textarea label={getText(lang, UIStringKeys.LabelCurrentStrategy)} id="currentStrategyAttempt" name="currentStrategyAttempt" value={data.currentStrategyAttempt} onChange={handleChange} placeholder={getText(lang, UIStringKeys.PlaceholderCurrentStrategy)} />
      </Card>
    </div>
  );
};

export default DiagnosisStep;
