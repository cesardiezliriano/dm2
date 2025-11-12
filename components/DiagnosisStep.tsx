
import React, { ChangeEvent, useRef, useState } from 'react';
import { DiagnosisData, FunnelStage, InvolvementLevel, Language, UIStringKeys } from '../types';
import { defaultFunnelStages, defaultInvolvementLevels, getText } from '../constants';
import Input from './common/Input';
import Textarea from './common/Textarea';
import Select from './common/Select';
import Card from './common/Card';
import { AcademicCapIcon, DocumentTextIcon, XMarkIcon } from './Icons';
import Button from './common/Button'; 
import AIHelperTextarea from './common/AIHelperTextarea';
import * as pdfjsLib from 'pdfjs-dist';
import LoadingSpinner from './common/LoadingSpinner';

interface DiagnosisStepProps {
  data: DiagnosisData;
  onUpdate: (data: Partial<DiagnosisData>) => void;
  isLoading: boolean;
  error: string | null;
  lang: Language;
}

const DiagnosisStep: React.FC<DiagnosisStepProps> = ({ data, onUpdate, lang }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsingPdf, setIsParsingPdf] = useState(false);

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

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Always clear previous file info first
    onUpdate({ briefingFileName: null, briefingFileContent: null });

    if (file && file.type === "application/pdf") {
      setIsParsingPdf(true);
      onUpdate({ briefingFileName: file.name });
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          // Type guard for TextItem
          const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
          fullText += pageText + '\n\n';
        }
        onUpdate({ briefingFileContent: fullText });
      } catch (error) {
        console.error("Failed to parse PDF:", error);
        onUpdate({ 
          briefingFileName: `Error parsing ${file.name}`, 
          briefingFileContent: `Error: ${error instanceof Error ? error.message : 'Unknown PDF parsing error.'}`
        });
        alert(`Failed to parse PDF: ${file.name}`);
      } finally {
        setIsParsingPdf(false);
      }
    } else if (file) {
      alert(getText(lang, UIStringKeys.AlertNonPDF));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onUpdate({ briefingFileName: null, briefingFileContent: null });
    }
  };

  const handleRemoveFile = () => {
    onUpdate({ briefingFileName: null, briefingFileContent: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const funnelStageOptions = defaultFunnelStages.map(stage => ({ value: stage, label: stage }));
  const involvementLevelOptions = defaultInvolvementLevels.map(level => ({ value: level, label: level }));

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
                {isParsingPdf && <LoadingSpinner size="sm" color="text-[#36A7B7]" lang={lang}/>}
                <span>
                    {isParsingPdf 
                        ? getText(lang, UIStringKeys.FileParsing, { fileName: data.briefingFileName })
                        : getText(lang, UIStringKeys.FileSelected, { fileName: data.briefingFileName })
                    }
                </span>
                {!isParsingPdf && (
                    <button 
                        onClick={handleRemoveFile} 
                        className="text-[#F54963] hover:text-[#D43A50]"
                        title={getText(lang, UIStringKeys.ButtonRemoveFile)}
                        type="button"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                )}
              </div>
            ) : (
              <span className="text-sm text-[#ACB4B6] font-['Open_Sans']">{getText(lang, UIStringKeys.PlaceholderNoFileSelected)}</span>
            )}
          </div>
        </div>
      </Card>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title={getText(lang, UIStringKeys.HeaderBusinessMarketContext)}>
          <Input label={`${getText(lang, UIStringKeys.LabelCustomerType)} *`} id="customerType" name="customerType" value={data.customerType} onChange={handleChange} placeholder={getText(lang, UIStringKeys.PlaceholderCustomerType)} />
          <Input label={`${getText(lang, UIStringKeys.LabelMarketCategory)} *`} id="market" name="market" value={data.market} onChange={handleChange} placeholder={getText(lang, UIStringKeys.PlaceholderMarketCategory)} />
          <Input label={`${getText(lang, UIStringKeys.LabelSectorIndustry)} *`} id="sector" name="sector" value={data.sector} onChange={handleChange} placeholder={getText(lang, UIStringKeys.PlaceholderSectorIndustry)} />
          <Input label={getText(lang, UIStringKeys.LabelProductService)} id="productOrService" name="productOrService" value={data.productOrService} onChange={handleChange} placeholder={getText(lang, UIStringKeys.PlaceholderProductService)} />
        </Card>

        <Card title={getText(lang, UIStringKeys.HeaderProblemConsumerContext)}>
          <AIHelperTextarea
            id="businessChallenge"
            name="businessChallenge"
            label={`${getText(lang, UIStringKeys.LabelBusinessChallenge)} *`}
            apiLabel={getText(lang, UIStringKeys.LabelBusinessChallenge)}
            value={data.businessChallenge}
            onChange={handleChange}
            placeholder={getText(lang, UIStringKeys.PlaceholderBusinessChallenge)}
            diagnosisContext={data}
            lang={lang}
          />
          <AIHelperTextarea
            id="customerChallenge"
            name="customerChallenge"
            label={`${getText(lang, UIStringKeys.LabelCustomerChallenge)} *`}
            apiLabel={getText(lang, UIStringKeys.LabelCustomerChallenge)}
            value={data.customerChallenge}
            onChange={handleChange}
            placeholder={getText(lang, UIStringKeys.PlaceholderCustomerChallenge)}
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
