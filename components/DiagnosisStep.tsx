
import React, { ChangeEvent, useRef, useState } from 'react';
import { DiagnosisData, FunnelStage, InvolvementLevel, Language, UIStringKeys, ScreenshotData } from '../types';
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
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [activeTab, setActiveTab] = useState<'pdf' | 'images' | 'manual'>('pdf');

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

  const handlePdfChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
      } finally {
        setIsParsingPdf(false);
      }
    } else if (file) {
      alert(getText(lang, UIStringKeys.AlertNonPDF));
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImagesChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const newScreenshots: ScreenshotData[] = [...(data.screenshots || [])];
      
      // Limit to 5 images total
      const slotsAvailable = 5 - newScreenshots.length;
      if (slotsAvailable <= 0) {
          alert("Max 5 images allowed");
          return;
      }

      // Explicitly cast to File[] to fix TypeScript 'unknown' type inference errors
      const filesToProcess = Array.from(files).slice(0, slotsAvailable) as File[];

      for (const file of filesToProcess) {
          if (file.type.startsWith('image/')) {
              try {
                  const base64Data = await new Promise<string>((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result as string);
                      reader.onerror = reject;
                      reader.readAsDataURL(file);
                  });
                  
                  // Split base64 to get raw data for API
                  const rawBase64 = base64Data.split(',')[1];
                  
                  newScreenshots.push({
                      name: file.name,
                      mimeType: file.type,
                      data: rawBase64,
                      previewUrl: base64Data // Includes prefix for <img src>
                  });
              } catch (e) {
                  console.error("Error reading image", file.name, e);
              }
          }
      }
      onUpdate({ screenshots: newScreenshots });
      if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleRemoveFile = () => {
    onUpdate({ briefingFileName: null, briefingFileContent: null });
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const handleRemoveScreenshot = (index: number) => {
      const updated = [...(data.screenshots || [])];
      updated.splice(index, 1);
      onUpdate({ screenshots: updated });
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

        {/* --- BRIEFING SOURCE TABS --- */}
        <div className="mt-6">
            <label className="block text-sm font-medium text-[#0A263B] mb-2 font-['Open_Sans']">
                {getText(lang, UIStringKeys.LabelBriefingSource)}
            </label>
            <div className="flex space-x-1 bg-[#F8F8F8] p-1 rounded-lg border border-[#DDDDDD] mb-4">
                <button
                    onClick={() => setActiveTab('pdf')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors font-['Montserrat'] ${activeTab === 'pdf' ? 'bg-white text-[#F54963] shadow-sm' : 'text-[#878E90] hover:text-[#0A263B]'}`}
                >
                    {getText(lang, UIStringKeys.TabPDF)}
                </button>
                <button
                    onClick={() => setActiveTab('images')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors font-['Montserrat'] ${activeTab === 'images' ? 'bg-white text-[#F54963] shadow-sm' : 'text-[#878E90] hover:text-[#0A263B]'}`}
                >
                    {getText(lang, UIStringKeys.TabImages)}
                </button>
                <button
                    onClick={() => setActiveTab('manual')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors font-['Montserrat'] ${activeTab === 'manual' ? 'bg-white text-[#F54963] shadow-sm' : 'text-[#878E90] hover:text-[#0A263B]'}`}
                >
                    {getText(lang, UIStringKeys.TabManualText)}
                </button>
            </div>

            {/* TAB CONTENT: PDF */}
            {activeTab === 'pdf' && (
                <div className="animate-fadeIn">
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
                        onChange={handlePdfChange}
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
            )}

            {/* TAB CONTENT: IMAGES */}
            {activeTab === 'images' && (
                <div className="animate-fadeIn">
                    <div className="mb-2">
                         <label 
                            htmlFor="imageInput" 
                            className="cursor-pointer px-4 py-2.5 bg-[#878E90] hover:bg-[#6D7475] text-white font-semibold rounded-lg shadow-md text-sm inline-flex items-center font-['Montserrat']"
                         >
                            <DocumentTextIcon className="w-4 h-4 mr-2" />
                            {getText(lang, UIStringKeys.ButtonUploadImages)}
                         </label>
                         <input
                            type="file"
                            id="imageInput"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                            ref={imageInputRef}
                            className="hidden"
                         />
                         <span className="ml-3 text-xs text-[#878E90] font-['Open_Sans']">
                             {data.screenshots?.length || 0} / 5
                         </span>
                    </div>

                    {data.screenshots && data.screenshots.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {data.screenshots.map((screen, idx) => (
                                <div key={idx} className="relative group border border-[#DDDDDD] rounded-lg overflow-hidden">
                                    <img src={screen.previewUrl} alt={screen.name} className="w-full h-24 object-cover" />
                                    <button 
                                        onClick={() => handleRemoveScreenshot(idx)}
                                        className="absolute top-1 right-1 bg-[#F54963] text-white rounded-full p-1 opacity-80 hover:opacity-100"
                                    >
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                    <div className="p-1 bg-white text-[10px] truncate text-[#0A263B]">{screen.name}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: MANUAL TEXT */}
            {activeTab === 'manual' && (
                <div className="animate-fadeIn">
                    <Textarea 
                        label={getText(lang, UIStringKeys.LabelManualBriefing)}
                        id="manualBriefingText"
                        name="manualBriefingText"
                        value={data.manualBriefingText || ''}
                        onChange={handleChange}
                        placeholder={getText(lang, UIStringKeys.PlaceholderManualBriefing)}
                        rows={6}
                    />
                </div>
            )}
        </div>
        {/* --- END TABS --- */}

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
